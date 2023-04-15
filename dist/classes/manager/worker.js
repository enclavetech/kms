import { DEFAULT_CONFIG } from '../../constants';
import { Manager } from './manager';
export class KeyWorker extends Manager {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(config = DEFAULT_CONFIG) {
        super();
        this.worker = new Worker(new URL('../../workers/key.worker.js?worker', import.meta.url), {
            type: 'module',
        });
        this.pendingJobs = new Map();
        this.jobCounter = 0;
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
            const jobID = this.jobCounter++;
            this.pendingJobs.set(jobID, (result) => {
                result.ok ? resolve(result) : reject(result);
            });
            this.worker.postMessage({ ...job, jobID });
        });
    }
    decrypt(data, privateKeyID) {
        return this.doJob({
            action: 'decrypt',
            privateKeyID,
            data,
        });
    }
    encrypt(data, privateKeyID) {
        return this.doJob({
            action: 'encrypt',
            privateKeyID,
            data,
        });
    }
    importKey(privateKey, privateKeyID) {
        if (!privateKeyID)
            privateKeyID = this.getNextID();
        return this.doJob({
            action: 'importKey',
            privateKeyID,
            data: privateKey,
        });
    }
}
