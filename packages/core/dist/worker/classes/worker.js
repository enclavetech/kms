import { EnclaveKmsActionError, EnclaveKmsError } from '../../shared';
import { kvStoreDelete, kvStoreGet, kvStoreSet } from '../utils/db';
import { KeyPairMap } from './key-pair-map';
import { WrappedAdapter } from './wrapped-adapter';
// TODO: group methods into namespaces
export class Worker {
    constructor(adapter) {
        this.keyPairMap = new KeyPairMap();
        this.asymmetricDecrypt = (job) => this.wrapJob(async () => {
            const { action, jobID } = job;
            const { kmsKeyID, payload } = job.payload;
            const privateKey = this.keyPairMap.getPrivateKey(kmsKeyID, job);
            const decryptedMessage = await this.adapter.decryptWithPrivateKey(payload, privateKey);
            return {
                action,
                jobID,
                ok: true,
                payload: { payload: decryptedMessage },
            };
        }, job);
        this.asymmetricEncrypt = (job) => this.wrapJob(async () => {
            const { action, jobID } = job;
            const { kmsKeyID, payload } = job.payload;
            const publicKey = this.keyPairMap.getPublicKey(kmsKeyID, job);
            const encryptedMessage = await this.adapter.encryptWithPublicKey(payload, publicKey);
            return {
                action,
                jobID,
                ok: true,
                payload: {
                    kmsKeyID,
                    payload: encryptedMessage,
                },
            };
        }, job);
        this.destroySession = (job) => this.wrapJob(async () => {
            const { action, jobID } = job;
            this.keyPairMap.clear();
            await kvStoreDelete('session_key');
            return { action, jobID, ok: true };
        }, job);
        this.encryptPrivateKey = (job) => this.wrapJob(async () => {
            const { action, jobID } = job;
            const { privateKey, secret } = job.payload;
            return {
                action,
                jobID,
                ok: true,
                payload: {
                    privateKey: await this.adapter.encryptPrivateKey(await this.adapter.parsePrivateKey(privateKey), secret),
                },
            };
        }, job);
        this.exportSession = (job) => this.wrapJob(async () => {
            const { action, jobID } = job;
            const session = {
                keys: new Array(),
            };
            for (const [id, keyPair] of this.keyPairMap) {
                const sessionKeyPair = {
                    id,
                    publicKey: await this.adapter.stringifyPublicKey(keyPair.publicKey),
                };
                if (keyPair.privateKey)
                    sessionKeyPair.privateKey = await this.adapter.stringifyPrivateKey(keyPair.privateKey);
                session.keys.push(sessionKeyPair);
            }
            const payload = JSON.stringify(session);
            const key = new TextDecoder().decode(crypto.getRandomValues(Uint8Array.from({ length: 32 })));
            const [sessionPayload] = await Promise.all([
                this.adapter.symmetricEncrypt(payload, key),
                // Store the session key
                kvStoreSet('session_key', key),
            ]);
            return {
                action,
                jobID,
                ok: true,
                payload: { sessionPayload },
            };
        }, job);
        this.generateKeyPair = (job) => this.wrapJob(async () => {
            const { action, jobID } = job;
            const keyPair = await this.adapter.generateKeyPair();
            const privateKeyPromise = job.payload?.secret
                ? this.adapter.encryptPrivateKey(keyPair.privateKey, job.payload.secret)
                : this.adapter.stringifyPrivateKey(keyPair.privateKey);
            const publicKeyPromise = this.adapter.stringifyPublicKey(keyPair.publicKey);
            const [privateKey, publicKey] = await Promise.all([privateKeyPromise, publicKeyPromise]);
            return {
                action,
                jobID,
                ok: true,
                payload: {
                    privateKey,
                    publicKey,
                },
            };
        }, job);
        this.hybridDecrypt = (job) => this.wrapJob(async () => {
            const { action, jobID } = job;
            const { kmsKeyID, payloadKey, payload } = job.payload;
            const privateKey = this.keyPairMap.getPrivateKey(kmsKeyID, job);
            const sessionKey = await this.adapter.decryptSessionKey(payloadKey, privateKey);
            const decryptedMessage = await this.adapter.decryptWithSessionKey(payload, sessionKey);
            return {
                action,
                jobID,
                ok: true,
                payload: { payload: decryptedMessage },
            };
        }, job);
        this.hybridEncrypt = (job) => this.wrapJob(async () => {
            const { action, jobID } = job;
            const { kmsKeyID, payload } = job.payload;
            const publicKey = this.keyPairMap.getPublicKey(kmsKeyID, job);
            const sessionKey = await this.adapter.generateSessionKey(publicKey);
            const [encryptedMessage, encryptedSessionKey] = await Promise.all([
                this.adapter.encryptWithSessionKey(payload, sessionKey),
                this.adapter.encryptSessionKey(sessionKey, publicKey),
            ]);
            return {
                action,
                jobID,
                ok: true,
                payload: {
                    payload: encryptedMessage,
                    payloadKey: encryptedSessionKey,
                },
            };
        }, job);
        this.importKeyPair = (job) => this.wrapJob(async () => {
            const { action, jobID } = job;
            const { keyID, privateKey, publicKey, secret } = job.payload;
            // TODO: derive public key from private key if necessary
            const keyPair = {
                publicKey: await this.adapter.parsePublicKey(publicKey),
            };
            if (privateKey)
                keyPair.privateKey = await (secret
                    ? this.adapter.decryptPrivateKey(privateKey, secret)
                    : this.adapter.parsePrivateKey(privateKey));
            this.keyPairMap.set(keyID, keyPair);
            return {
                action,
                jobID,
                ok: true,
                payload: { keyIDs: [keyID] },
            };
        }, job);
        this.importSession = (job) => this.wrapJob(async () => {
            const { action, jobID } = job;
            const sessionEncrypted = job.payload.sessionPayload;
            const key = await kvStoreGet('session_key').catch(() => {
                throw new EnclaveKmsActionError(job.action, 'No session key found');
            });
            const sessionDecrypted = await this.adapter.symmetricDecrypt(sessionEncrypted, key);
            const session = (() => {
                try {
                    return JSON.parse(sessionDecrypted);
                }
                catch (e) {
                    throw new EnclaveKmsActionError(job.action, 'Unable to parse session data');
                }
            })();
            const importedKeyIDs = new Array();
            let ok = true;
            await Promise.allSettled(session.keys.map(async ({ id: keyID, privateKey, publicKey }) => {
                try {
                    return this.importKeyPair({ action: 'importKeyPair', jobID, payload: { keyID, privateKey, publicKey } });
                }
                catch (e) {
                    ok = false;
                }
            }));
            return {
                action,
                error: ok ? undefined : 'One or more keys could not be parsed',
                jobID,
                ok,
                payload: {
                    importedKeyIDs,
                    reexported: false,
                },
            };
        }, job);
        this.reencryptSessionKey = (job) => this.wrapJob(async () => {
            const { action, jobID } = job;
            const { decryptKeyID, encryptKeyID, sessionKey } = job.payload;
            const decryptKey = this.keyPairMap.getPrivateKey(decryptKeyID, job);
            const encryptKey = this.keyPairMap.getPublicKey(encryptKeyID, job);
            const decryptedSessionKey = await this.adapter.decryptSessionKey(sessionKey, decryptKey);
            const encryptedSessionKey = await this.adapter.encryptSessionKey(decryptedSessionKey, encryptKey);
            return {
                action,
                jobID,
                ok: true,
                payload: {
                    kmsKeyID: encryptKeyID,
                    payload: encryptedSessionKey,
                },
            };
        }, job);
        this.symmetricDecrypt = (job) => this.wrapJob(async () => {
            const { action, jobID } = job;
            const { payload, passphrase } = job.payload;
            return {
                action,
                jobID,
                ok: true,
                payload: { payload: await this.adapter.symmetricDecrypt(payload, passphrase) },
            };
        }, job);
        this.symmetricEncrypt = (job) => this.wrapJob(async () => {
            const { action, jobID } = job;
            const { payload, passphrase } = job.payload;
            return {
                action,
                jobID,
                ok: true,
                payload: { payload: await this.adapter.symmetricEncrypt(payload, passphrase) },
            };
        }, job);
        this.adapter = new WrappedAdapter(adapter);
        self.onmessage = async (event) => {
            const job = event.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handler = this[job.action].bind(this);
            if (!handler)
                throw this.errorResponse('No such action', job);
            return self.postMessage(await handler(job));
        };
    }
    /**
     * Ensures an error response message is sent on exception.
     * @param fn The function to wrap.
     * @param job The job being processed.
     * @returns The return from `fn`.
     */
    async wrapJob(fn, job) {
        try {
            return await fn();
        }
        catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            this.errorResponse(errorMessage, job);
            throw e instanceof EnclaveKmsError ? e : new EnclaveKmsActionError(job.action, errorMessage);
        }
    }
    errorResponse(error, job) {
        const { action, jobID } = job;
        const response = {
            action,
            error,
            jobID,
            ok: false,
        };
        self.postMessage(response);
    }
}
