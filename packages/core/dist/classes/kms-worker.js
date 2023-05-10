import { KMS } from './kms';
export class KmsWorkerCore extends KMS {
    constructor() {
        super(...arguments);
        this.pendingJobs = {};
        this.jobCounter = 0;
    }
    onmessage(event) {
        const response = event.data;
        const { jobID, ...result } = response;
        const callback = this.pendingJobs[jobID];
        if (!callback) {
            const { ok } = response;
            return console.warn(`Enclave KMS: Job [${jobID}]: finished with status: ${JSON.stringify({
                ok,
            })} but no callback found.`);
        }
        callback(result);
        delete this.pendingJobs[jobID];
    }
    postJob(request) {
        return new Promise((resolve, reject) => {
            const jobID = this.jobCounter++;
            this.pendingJobs[jobID] = function (result) {
                result.ok ? resolve(result) : reject(result);
            };
            this.worker.postMessage({ ...request, jobID });
        });
    }
    importKey(keyImportRequest) {
        return this.postJob({
            action: 'importKey',
            payload: keyImportRequest,
        });
    }
    destroySession() {
        return this.postJob({
            action: 'destroySession',
            payload: undefined,
        });
    }
    exportSession() {
        return this.postJob({
            action: 'exportSession',
            payload: undefined,
        });
    }
    importSession(payload) {
        return this.postJob({
            action: 'importSession',
            payload,
        });
    }
    decrypt(decryptRequest) {
        return this.postJob({
            action: 'decrypt',
            payload: decryptRequest,
        });
    }
    encrypt(encryptRequest) {
        return this.postJob({
            action: 'encrypt',
            payload: encryptRequest,
        });
    }
    hybridDecrypt(hybridDecryptRequest) {
        return this.postJob({
            action: 'hybridDecrypt',
            payload: hybridDecryptRequest,
        });
    }
    hybridEncrypt(hybridEncryptRequest) {
        return this.postJob({
            action: 'hybridEncrypt',
            payload: hybridEncryptRequest,
        });
    }
}
