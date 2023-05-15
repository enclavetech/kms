import { WorkerAsymmetricNS, WorkerHybridNS, WorkerKeysNS, WorkerSessionNS, WorkerSymmetricNS } from './namespaces';
export class KmsWorkerCore {
    constructor() {
        this.pendingJobs = {};
        this.jobCounter = 0;
        this.postJob = (async (payload) => {
            return new Promise((resolve, reject) => {
                const jobID = this.jobCounter++;
                this.pendingJobs[jobID] = function (result) {
                    result.ok ? resolve(result) : reject(result);
                };
                this.worker.postMessage({ jobID, ...payload });
            });
        }).bind(this);
        this.asymmetric = new WorkerAsymmetricNS(this.postJob);
        this.hybrid = new WorkerHybridNS(this.postJob);
        this.keys = new WorkerKeysNS(this.postJob);
        this.session = new WorkerSessionNS(this.postJob);
        this.symmetric = new WorkerSymmetricNS(this.postJob);
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
}
