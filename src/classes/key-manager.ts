import type {
  KeyManagerResult,
  WorkerDecryptJob,
  WorkerEncryptJob,
  WorkerJob,
  WorkerPutJob,
  WorkerResponse,
} from '../interfaces';
import type { KeyManagerAction, KeyManagerCallback, PrivateKey, PrivateKeyID } from '../types';

export class KeyManager {
  private readonly worker = new Worker(new URL('../workers/key.worker.js?worker', import.meta.url), {
    type: 'module',
  });

  private readonly pendingJobs = new Map<number, KeyManagerCallback>();
  private requestCounter = 0;

  constructor() {
    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;
      const { jobID, ok } = response;

      const callback = this.pendingJobs.get(jobID);

      if (!callback) {
        return console.warn(
          `Key Manager: Job [${jobID}]: finished with status: ${JSON.stringify({
            ok,
          })} but no callback found.`
        );
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { jobID, ...result } = response;
        callback(result);
        this.pendingJobs.delete(jobID);
      }
    };
  }

  private doJob<J extends WorkerJob<KeyManagerAction, unknown>>(job: Omit<J, 'jobID'>) {
    return new Promise<KeyManagerResult>((resolve, reject) => {
      const jobID = this.requestCounter++;
      this.pendingJobs.set(jobID, (result) => {
        result.ok ? resolve(result) : reject(result);
      });
      this.worker.postMessage({ ...job, requestID: jobID });
    });
  }

  put(privateKeyID: PrivateKeyID, armoredKey: PrivateKey): Promise<KeyManagerResult> {
    return this.doJob<WorkerPutJob>({
      action: 'put',
      privateKeyID,
      data: armoredKey,
    });
  }

  decrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult> {
    return this.doJob<WorkerDecryptJob>({
      action: 'decrypt',
      privateKeyID,
      data,
    });
  }

  encrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult> {
    return this.doJob<WorkerEncryptJob>({
      action: 'encrypt',
      privateKeyID,
      data,
    });
  }
}
