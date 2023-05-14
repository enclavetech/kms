import { EnclaveKmsActionError, EnclaveKmsError } from '../../shared';
import { kvStoreDelete, kvStoreGet, kvStoreSet } from '../utils/db';
import { WrappedLibImpl } from './wrapped-lib-impl';
export class Worker {
    constructor(libImpl) {
        this.keyPairMap = {}; // TODO: `KeyPairMap` class
        this.asymmetricDecrypt = (job) => this.wrap(async () => {
            const { action, jobID } = job;
            const { kmsKeyID, payload } = job.payload;
            const privateKey = this.getPrivateKey(kmsKeyID, job);
            const decryptedMessage = await this.libImpl.decryptWithPrivateKey(payload, privateKey);
            return {
                action,
                jobID,
                ok: true,
                payload: { payload: decryptedMessage },
            };
        }, job);
        this.asymmetricEncrypt = (job) => this.wrap(async () => {
            const { action, jobID } = job;
            const { kmsKeyID, payload } = job.payload;
            // TODO: use public key
            const publicKey = this.getPublicKey(kmsKeyID, job);
            const encryptedMessage = await this.libImpl.encryptWithPublicKey(payload, publicKey);
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
        this.destroySession = (job) => this.wrap(async () => {
            const { action, jobID } = job;
            // clear all keys from memory
            this.keyPairMap = {};
            // clear stored session key
            await kvStoreDelete('session_key');
            return { action, jobID, ok: true };
        }, job);
        this.exportSession = (job) => this.wrap(async () => {
            const { action, jobID } = job;
            const session = {
                keys: new Array(),
            };
            for (const [id, keyPair] of Object.entries(this.keyPairMap)) {
                const sessionKeyPair = {
                    id,
                    publicKey: await this.libImpl.stringifyPublicKey(keyPair.publicKey),
                };
                if (keyPair.privateKey)
                    sessionKeyPair.privateKey = await this.libImpl.stringifyPrivateKey(keyPair.privateKey);
                session.keys.push(sessionKeyPair);
            }
            const payload = JSON.stringify(session);
            const key = new TextDecoder().decode(crypto.getRandomValues(Uint8Array.from({ length: 32 })));
            const [sessionPayload] = await Promise.all([
                this.libImpl.symmetricEncrypt(payload, key),
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
        this.hybridDecrypt = (job) => this.wrap(async () => {
            const { action, jobID } = job;
            const { kmsKeyID, payloadKey, payload } = job.payload;
            const privateKey = this.getPrivateKey(kmsKeyID, job);
            const sessionKey = await this.libImpl.decryptSessionKey(payloadKey, privateKey);
            const decryptedMessage = await this.libImpl.decryptWithSessionKey(payload, sessionKey);
            return {
                action,
                jobID,
                ok: true,
                payload: { payload: decryptedMessage },
            };
        }, job);
        this.hybridEncrypt = (job) => this.wrap(async () => {
            const { action, jobID } = job;
            const { kmsKeyID, payload } = job.payload;
            const publicKey = this.getPublicKey(kmsKeyID, job);
            const sessionKey = await this.libImpl.generateSessionKey(publicKey);
            const [encryptedMessage, encryptedSessionKey] = await Promise.all([
                this.libImpl.encryptWithSessionKey(payload, sessionKey),
                this.libImpl.encryptSessionKey(sessionKey, await this.getPublicKey(kmsKeyID, job)),
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
        this.importKeyPair = (job) => this.wrap(async () => {
            const { action, jobID } = job;
            const { keyID, privateKey, publicKey } = job.payload;
            // TODO: derive public key from private key if necessary
            const keyPair = {
                publicKey: await this.libImpl.parsePublicKey(publicKey),
            };
            if (privateKey)
                keyPair.privateKey = await this.libImpl.parsePrivateKey(privateKey);
            this.keyPairMap[keyID] = keyPair;
            return {
                action,
                jobID,
                ok: true,
                payload: { keyIDs: [keyID] },
            };
        }, job);
        this.importSession = (job) => this.wrap(async () => {
            const { action, jobID } = job;
            const sessionEncrypted = job.payload.sessionPayload;
            const key = await kvStoreGet('session_key').catch(() => {
                throw new EnclaveKmsActionError(job.action, 'No session key found');
            });
            const sessionDecrypted = await this.libImpl.symmetricDecrypt(sessionEncrypted, key);
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
        this.reencryptSessionKey = (job) => this.wrap(async () => {
            const { action, jobID } = job;
            const { decryptKeyID, encryptKeyID, sessionKey } = job.payload;
            const decryptKey = this.getPrivateKey(decryptKeyID, job);
            const encryptKey = this.getPublicKey(encryptKeyID, job);
            const decryptedSessionKey = await this.libImpl.decryptSessionKey(sessionKey, decryptKey);
            const encryptedSessionKey = await this.libImpl.encryptSessionKey(decryptedSessionKey, encryptKey);
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
        this.libImpl = new WrappedLibImpl(libImpl);
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
    async wrap(fn, job) {
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
    getKeyPair(keyID, job) {
        const keyPair = this.keyPairMap[keyID];
        if (!keyPair)
            throw new EnclaveKmsActionError(job.action, `Key pair with ID ${keyID} not found`);
        return keyPair;
    }
    getPrivateKey(keyID, job) {
        const { privateKey } = this.getKeyPair(keyID, job);
        if (!privateKey)
            throw new EnclaveKmsActionError(job.action, `We do not have the private key for key pair ID ${keyID}`);
        return privateKey;
    }
    getPublicKey(keyID, job) {
        return this.getKeyPair(keyID, job).publicKey;
    }
}
