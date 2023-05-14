import { EnclaveKmsActionError, EnclaveKmsError } from '../../shared';
import { kvStoreDelete, kvStoreGet, kvStoreSet } from '../utils/db';
import { WrappedLibImpl } from './wrapped-lib-impl';
export class Worker {
    constructor(libImpl) {
        this.keyMap = {};
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
            const privateKey = this.getPrivateKey(kmsKeyID, job);
            const encryptedMessage = await this.libImpl.encryptWithPrivateKey(payload, privateKey);
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
            this.keyMap = {};
            // clear stored session key
            await kvStoreDelete('session_key');
            return { action, jobID, ok: true };
        }, job);
        this.exportSession = (job) => this.wrap(async () => {
            const { action, jobID } = job;
            const session = {
                keys: new Array(),
            };
            for (const [id, key] of Object.entries(this.keyMap)) {
                session.keys.push({ id, key: await this.libImpl.stringifyPrivateKey(key) });
            }
            const payload = JSON.stringify(session);
            const key = await this.libImpl.generatePrivateKey();
            const [sessionPayload] = await Promise.all([
                this.libImpl.encryptWithPrivateKey(payload, key),
                // Store the session key
                kvStoreSet('session_key', await this.libImpl.stringifyPrivateKey(key)),
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
            // TODO: use public key
            const privateKey = this.getPrivateKey(kmsKeyID, job);
            const sessionKey = await this.libImpl.generateSessionKey(privateKey);
            const [encryptedMessage, encryptedSessionKey] = await Promise.all([
                this.libImpl.encryptWithSessionKey(payload, sessionKey),
                this.libImpl.encryptSessionKey(sessionKey, privateKey),
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
        this.importPrivateKey = (job) => this.wrap(async () => {
            const { action, jobID } = job;
            const { privateKey: key, keyID } = job.payload;
            try {
                this.keyMap[keyID] = await this.libImpl.parsePrivateKey(key);
            }
            catch (e) {
                throw this.errorResponse('Failed to parse private key', job);
            }
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
            const keyEncoded = await kvStoreGet('session_key').catch(() => {
                throw new EnclaveKmsActionError(job.action, 'No session key found');
            });
            const key = await this.libImpl.parsePrivateKey(keyEncoded);
            const sessionDecrypted = await this.libImpl.decryptWithPrivateKey(sessionEncrypted, key);
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
            await Promise.allSettled(session.keys.map(async ({ id, key }) => {
                try {
                    this.keyMap[id] = await this.libImpl.parsePrivateKey(key);
                    importedKeyIDs.push(id);
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
            const encryptKey = this.getPrivateKey(encryptKeyID, job); // TODO: use public key
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
            throw e instanceof EnclaveKmsError ? e : new EnclaveKmsError(errorMessage);
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
    getPrivateKey(keyID, job) {
        const privateKey = this.keyMap[keyID];
        if (!privateKey) {
            throw new EnclaveKmsActionError(job.action, `Key '${keyID}' not found`);
        }
        return privateKey;
    }
}
