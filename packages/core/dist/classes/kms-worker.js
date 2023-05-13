import { KMS } from './kms';
export class KmsWorkerCore extends KMS {
    constructor() {
        super(...arguments);
        this.pendingJobs = {};
        this.jobCounter = 0;
    }
    handleCompletedJob(event) {
        const { jobID, ...result } = event.data;
        const callback = this.pendingJobs[jobID];
        if (!callback) {
            return console.warn(`Enclave KMS: Job [${jobID}]: finished with status: ${JSON.stringify({
                ok: event.data.ok,
            })} but no callback found.`);
        }
        callback(result);
        delete this.pendingJobs[jobID];
    }
    postJob(action, payload) {
        return new Promise((resolve, reject) => {
            const jobID = this.jobCounter++;
            this.pendingJobs[jobID] = function (result) {
                result.ok ? resolve(result.payload) : reject(result.error);
            };
            this.worker.postMessage({ action, jobID, payload });
        });
    }
    asymmetricDecrypt(request) {
        return this.postJob('asymmetricDecrypt', request);
    }
    asymmetricEncrypt(request) {
        return this.postJob('asymmetricEncrypt', request);
    }
    destroySession() {
        return this.postJob('destroySession');
    }
    exportSession() {
        return this.postJob('exportSession');
    }
    hybridDecrypt(request) {
        return this.postJob('hybridDecrypt', request);
    }
    hybridEncrypt(request) {
        return this.postJob('hybridEncrypt', request);
    }
    importPrivateKey(request) {
        return this.postJob('importPrivateKey', request);
    }
    async importSession(request) {
        const importResult = (await this.postJob('importSession', request));
        return (request.reexport
            ? {
                ...importResult,
                reexported: true,
                ...(await this.postJob('exportSession')),
            }
            : importResult);
    }
    reencryptSessionKey(request) {
        return this.postJob('reencryptSessionKey', request);
    }
}
