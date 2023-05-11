import { kvStoreDelete, kvStoreGet, kvStoreSet } from '../utils/db';
// TODO: break functions into individual files and try and find a DRYer way to wrap them
export class Worker {
    constructor(libImpl) {
        this.libImpl = libImpl;
        this.keyMap = {};
        self.onmessage = async (event) => {
            const job = event.data;
            try {
                switch (job.action) {
                    case 'importKey':
                        return self.postMessage(await this.importKeyJob(job));
                    case 'destroySession':
                        return self.postMessage(await this.destroySessionJob(job));
                    case 'exportSession':
                        return self.postMessage(await this.exportSessionJob(job));
                    case 'importSession':
                        return self.postMessage(await this.importSessionJob(job));
                    case 'importExportSession':
                        return self.postMessage(await this.importExportSessionJob(job));
                    case 'decrypt':
                        return self.postMessage(await this.decryptJob(job));
                    case 'encrypt':
                        return self.postMessage(await this.encryptJob(job));
                    case 'hybridDecrypt':
                        return self.postMessage(await this.hybridDecryptJob(job));
                    case 'hybridEncrypt':
                        return self.postMessage(await this.hybridEncryptJob(job));
                }
            }
            catch (e) {
                console.error(e);
                throw this.errorResponse('Unexpected error', job);
            }
        };
    }
    errorResponse(error, job) {
        const { action, jobID } = job;
        const response = {
            action,
            error,
            jobID,
            ok: false,
            payload: undefined,
        };
        self.postMessage(response);
        throw `Key Manager: ${action} job failed: ${error}.`;
    }
    getPrivateKey(keyID, job) {
        const privateKey = this.keyMap[keyID];
        if (!privateKey) {
            throw this.errorResponse(`Key '${keyID}' not found`, job);
        }
        return privateKey;
    }
    async importKeyJob(job) {
        const { action, jobID } = job;
        const { key, keyID } = job.payload;
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
            payload: keyID,
        };
    }
    async destroySessionJob(job) {
        const { action, jobID } = job;
        this.keyMap = {};
        await kvStoreDelete('session_key');
        return {
            action,
            jobID,
            ok: true,
            payload: undefined,
        };
    }
    async exportSessionJob(job) {
        const { action, jobID } = job;
        const session = {
            keys: new Array(),
        };
        for (const [id, key] of Object.entries(this.keyMap)) {
            session.keys.push({ id, key: await this.libImpl.stringifyPrivateKey(key) });
        }
        const payload = JSON.stringify(session);
        let key;
        let sessionEncrypted;
        try {
            key = await this.libImpl.generatePrivateKey();
        }
        catch (e) {
            throw this.errorResponse('Failed to generate key', job);
        }
        try {
            sessionEncrypted = await this.libImpl.encryptWithPrivateKey(payload, key);
        }
        catch (e) {
            throw this.errorResponse('Failed to encrypt payload', job);
        }
        try {
            await kvStoreSet('session_key', await this.libImpl.stringifyPrivateKey(key));
        }
        catch (e) {
            throw this.errorResponse('Failed to store session key', job);
        }
        return {
            action,
            jobID,
            ok: true,
            payload: sessionEncrypted,
        };
    }
    async importSessionJob(job) {
        const { action, jobID } = job;
        const sessionEncrypted = job.payload;
        let keyEncoded;
        let key;
        let sessionDecrypted;
        let session;
        // TODO: A more DRY way to throw errors
        try {
            keyEncoded = await kvStoreGet('session_key');
            key = await this.libImpl.parsePrivateKey(keyEncoded);
        }
        catch (e) {
            throw this.errorResponse('No key found for session', job);
        }
        try {
            key = await this.libImpl.parsePrivateKey(keyEncoded);
        }
        catch (e) {
            throw this.errorResponse('Unable to parse session key', job);
        }
        try {
            sessionDecrypted = await this.libImpl.decryptWithPrivateKey(sessionEncrypted, key);
        }
        catch (e) {
            throw this.errorResponse('Unable to read message', job);
        }
        try {
            session = JSON.parse(sessionDecrypted);
        }
        catch (e) {
            throw this.errorResponse('Unable to parse session data', job);
        }
        const keyIDs = new Array();
        let ok = true;
        await Promise.allSettled(session.keys.map(async ({ id, key }) => {
            try {
                this.keyMap[id] = await this.libImpl.parsePrivateKey(key);
                keyIDs.push(id);
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
            payload: keyIDs,
        };
    }
    async importExportSessionJob(job) {
        const { action, jobID, payload } = job;
        const { error, ok, payload: keyIDs, } = await this.importSessionJob({
            action: 'importSession',
            jobID,
            payload,
        });
        const { payload: sessionExportPayload } = await this.exportSessionJob({
            action: 'exportSession',
            jobID,
            payload: undefined,
        });
        return {
            action,
            error,
            jobID,
            ok,
            payload: {
                keyIDs,
                sessionExportPayload,
            },
        };
    }
    async decryptJob(job) {
        const { action, jobID } = job;
        const { kmsKeyID, payload } = job.payload;
        const privateKey = this.getPrivateKey(kmsKeyID, job);
        let decryptedMessage;
        try {
            decryptedMessage = await this.libImpl.decryptWithPrivateKey(payload, privateKey);
        }
        catch (e) {
            throw this.errorResponse('Unable to decrypt message', job);
        }
        return {
            action,
            jobID,
            ok: true,
            payload: decryptedMessage,
        };
    }
    async encryptJob(job) {
        const { action, jobID } = job;
        const { kmsKeyID, payload } = job.payload;
        // TODO: use public key
        const privateKey = this.getPrivateKey(kmsKeyID, job);
        let encryptedMessage;
        try {
            encryptedMessage = await this.libImpl.encryptWithPrivateKey(payload, privateKey);
        }
        catch (e) {
            throw this.errorResponse('Unable to encrypt message', job);
        }
        return {
            action,
            jobID,
            ok: true,
            payload: {
                kmsKeyID,
                payload: encryptedMessage,
            },
        };
    }
    async hybridDecryptJob(job) {
        const { action, jobID } = job;
        const { kmsKeyID, payloadKey, payload } = job.payload;
        const privateKey = this.getPrivateKey(kmsKeyID, job);
        let sessionKey;
        let decryptedMessage;
        try {
            sessionKey = await this.libImpl.decryptSessionKey(payloadKey, privateKey);
        }
        catch (e) {
            throw this.errorResponse('Unable to decrypt session key', job);
        }
        try {
            decryptedMessage = await this.libImpl.decryptWithSessionKey(payload, sessionKey);
        }
        catch (e) {
            throw this.errorResponse('Unable to decrypt message', job);
        }
        return {
            action,
            jobID,
            ok: true,
            payload: decryptedMessage,
        };
    }
    async hybridEncryptJob(job) {
        const { action, jobID } = job;
        const { kmsKeyID, payload } = job.payload;
        // TODO: use public key
        const privateKey = this.getPrivateKey(kmsKeyID, job);
        let sessionKey;
        let encryptedMessage;
        let encryptedSessionKey;
        try {
            sessionKey = await this.libImpl.generateSessionKey(privateKey);
        }
        catch (e) {
            throw this.errorResponse('Unable to generate session key', job);
        }
        try {
            encryptedMessage = await this.libImpl.encryptWithSessionKey(payload, sessionKey);
        }
        catch (e) {
            throw this.errorResponse('Unable to encrypt message', job);
        }
        try {
            encryptedSessionKey = await this.libImpl.encryptSessionKey(sessionKey, privateKey);
        }
        catch (e) {
            throw this.errorResponse('Unable to encrypt session key', job);
        }
        return {
            action,
            jobID,
            ok: true,
            payload: {
                payload: encryptedMessage,
                payloadKey: encryptedSessionKey,
            },
        };
    }
}
