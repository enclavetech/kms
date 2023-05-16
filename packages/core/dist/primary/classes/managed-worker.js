export class ManagedWorker {
    constructor(worker) {
        this.worker = worker;
        this.pendingJobs = {};
        this.jobCounter = 0;
    }
    postJob(payload) {
        return new Promise((resolve, reject) => {
            const jobID = this.jobCounter++;
            this.pendingJobs[jobID] = function (result) {
                result.ok ? resolve(result) : reject(result);
            };
            this.worker.postMessage({ jobID, ...payload });
            this.worker.onmessage = (event) => {
                const { jobID, ...result } = event.data;
                const callback = this.pendingJobs[jobID];
                delete this.pendingJobs[jobID];
                if (!callback) {
                    return console.warn(`Enclave KMS: Job [${jobID}]: finished with status: ${JSON.stringify({
                        ok: event.data.ok,
                    })} but no callback found.`);
                }
                callback(result);
            };
        });
    }
}
