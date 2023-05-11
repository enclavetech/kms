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
    postJob(action, payload) {
        return new Promise((resolve, reject) => {
            const jobID = this.jobCounter++;
            this.pendingJobs[jobID] = function (result) {
                result.ok ? resolve(result) : reject(result);
            };
            this.worker.postMessage({ action, jobID, payload });
        });
    }
    importKey(payload) {
        return this.postJob('importKey', payload);
    }
    destroySession() {
        return this.postJob('destroySession');
    }
    exportSession() {
        return this.postJob('exportSession');
    }
    importSession(payload) {
        return this.postJob('importSession', payload);
    }
    decrypt(payload) {
        return this.postJob('decrypt', payload);
    }
    encrypt(payload) {
        return this.postJob('encrypt', payload);
    }
    hybridDecrypt(payload) {
        return this.postJob('hybridDecrypt', payload);
    }
    hybridEncrypt(payload) {
        return this.postJob('hybridEncrypt', payload);
    }
}
