export class KmsWorkerCore {
    constructor() {
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
    postJob(payload) {
        return new Promise((resolve, reject) => {
            const jobID = this.jobCounter++;
            this.pendingJobs[jobID] = function (result) {
                result.ok ? resolve(result) : reject(result);
            };
            this.worker.postMessage({ jobID, ...payload });
        });
    }
    async asymmetricDecrypt(payload) {
        return (await this.postJob({ action: 'asymmetricDecrypt', payload })).payload;
    }
    async asymmetricEncrypt(payload) {
        return (await this.postJob({ action: 'asymmetricEncrypt', payload })).payload;
    }
    async destroySession() {
        await this.postJob({ action: 'destroySession' });
    }
    async exportSession() {
        return (await this.postJob({ action: 'exportSession' })).payload;
    }
    async hybridDecrypt(payload) {
        return (await this.postJob({ action: 'hybridDecrypt', payload })).payload;
    }
    async hybridEncrypt(payload) {
        return (await this.postJob({ action: 'hybridEncrypt', payload })).payload;
    }
    importKeys(...payloads) {
        return Promise.all(payloads.map(async (payload) => (await this.postJob({ action: 'importKeyPair', payload })).payload));
    }
    async importSession(payload) {
        const importResult = (await this.postJob({ action: 'importSession', payload })).payload;
        return (payload.reexport
            ? {
                ...importResult,
                ...(await this.exportSession()),
                reexported: true,
            }
            : importResult);
    }
    async reencryptSessionKey(payload) {
        return (await this.postJob({ action: 'reencryptSessionKey', payload })).payload;
    }
}
