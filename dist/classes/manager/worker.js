import { DEFAULT_CONFIG } from '../../constants';
import { KeyManager } from './manager';
export class KeyWorkerManager extends KeyManager {
    constructor(config = DEFAULT_CONFIG) {
        super();
        this.config = config;
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
    doJob(request) {
        return new Promise((resolve, reject) => {
            const jobID = this.jobCounter++;
            this.pendingJobs.set(jobID, (result) => {
                result.ok ? resolve(result) : reject(result);
            });
            this.worker.postMessage({ ...request, jobID });
        });
    }
    importKey(data, keyID = this.getNextID()) {
        return this.doJob({
            action: 'importKey',
            keyID,
            data,
        });
    }
    destroySession() {
        return this.doJob({
            action: 'destroySession',
        });
    }
    exportSession() {
        return this.doJob({
            action: 'exportSession',
        });
    }
    importSession(data) {
        return this.doJob({
            action: 'importSession',
            data,
        });
    }
    decrypt(data, keyID) {
        return this.doJob({
            action: 'decrypt',
            keyID,
            data,
        });
    }
    encrypt(data, keyID) {
        return this.doJob({
            action: 'encrypt',
            keyID,
            data,
        });
    }
}
