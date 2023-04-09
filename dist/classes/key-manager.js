export class KeyManager {
    constructor() {
        this.worker = new Worker(new URL('../workers/key.worker.js?worker', import.meta.url), {
            type: 'module',
        });
        this.pendingRequests = new Map();
        this.requestCounter = 0;
        this.worker.onmessage = (event) => {
            const response = event.data;
            const callback = this.pendingRequests.get(response.requestID);
            if (!callback) {
                return console.warn(`Key Manager: Request [${response.requestID}]: finished with status: ${JSON.stringify({
                    ok: response.ok,
                })} but no callback found.`);
            }
            if (response.ok) {
                callback(null, response);
            }
            else if (response.error instanceof Error) {
                callback(response.error);
            }
            else {
                callback(new Error(response.error));
            }
            this.pendingRequests.delete(response.requestID);
        };
    }
    postMessage(message, callback) {
        const requestID = this.requestCounter++;
        this.pendingRequests.set(requestID, callback);
        this.worker.postMessage({ ...message, requestID });
    }
    put(id, armoredKey) {
        return new Promise((resolve, reject) => {
            this.postMessage({
                action: 'put',
                id,
                payload: armoredKey,
            }, (error, result) => {
                error || !result ? reject(error) : resolve(result);
            });
        });
    }
    decrypt(id, payload) {
        return new Promise((resolve, reject) => {
            this.postMessage({
                action: 'decrypt',
                id,
                payload,
            }, (error, result) => {
                if (error || !result) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    encrypt(id, payload) {
        return new Promise((resolve, reject) => {
            this.postMessage({
                action: 'encrypt',
                id,
                payload,
            }, (error, result) => {
                if (error || !result) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
