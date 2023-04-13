// TODO: make an abstract API for this and `ClusterManager`
export class WorkerManager {
    constructor() {
        this.worker = new Worker(new URL('../workers/key.worker.js?worker', import.meta.url), {
            type: 'module',
        });
        this.pendingJobs = new Map();
        this.requestCounter = 0;
        this.worker.onmessage = (event) => {
            const response = event.data;
            const { jobID, ok } = response;
            const callback = this.pendingJobs.get(jobID);
            if (!callback) {
                return console.warn(`Key Manager: Job [${jobID}]: finished with status: ${JSON.stringify({
                    ok,
                })} but no callback found.`);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { jobID, ...result } = response;
                callback(result);
                this.pendingJobs.delete(jobID);
            }
        };
    }
    doJob(job) {
        return new Promise((resolve, reject) => {
            const jobID = this.requestCounter++;
            this.pendingJobs.set(jobID, (result) => {
                result.ok ? resolve(result) : reject(result);
            });
            this.worker.postMessage({ ...job, requestID: jobID });
        });
    }
    put(privateKeyID, armoredKey) {
        return this.doJob({
            action: 'put',
            privateKeyID,
            data: armoredKey,
        });
    }
    decrypt(privateKeyID, data) {
        return this.doJob({
            action: 'decrypt',
            privateKeyID,
            data,
        });
    }
    encrypt(privateKeyID, data) {
        return this.doJob({
            action: 'encrypt',
            privateKeyID,
            data,
        });
    }
}
