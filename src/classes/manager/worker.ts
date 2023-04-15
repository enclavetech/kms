import type { PrivateKey } from 'openpgp';
import { DEFAULT_CONFIG } from '../../constants';
import type {
  IKeyManager,
  KeyManagerConfig,
  KeyManagerResult,
  WorkerDecryptJob,
  WorkerEncryptJob,
  WorkerJob,
  WorkerPutJob,
  WorkerResponse,
} from '../../interfaces';
import type { KeyManagerAction, KeyManagerCallback, PrivateKeyID } from '../../types';
import { Manager } from './manager';

export class KeyWorker extends Manager implements IKeyManager {
  private readonly worker = new Worker(new URL('../../workers/key.worker.js?worker', import.meta.url), {
    type: 'module',
  });

  private readonly pendingJobs = new Map<number, KeyManagerCallback>();
  private jobCounter = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(config: KeyManagerConfig = DEFAULT_CONFIG) {
    super();
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
      const jobID = this.jobCounter++;
      this.pendingJobs.set(jobID, (result) => {
        result.ok ? resolve(result) : reject(result);
      });
      this.worker.postMessage({ ...job, jobID });
    });
  }

  decrypt(data: string, privateKeyID: PrivateKeyID): Promise<KeyManagerResult> {
    return this.doJob<WorkerDecryptJob>({
      action: 'decrypt',
      privateKeyID,
      data,
    });
  }

  encrypt(data: string, privateKeyID: PrivateKeyID): Promise<KeyManagerResult> {
    return this.doJob<WorkerEncryptJob>({
      action: 'encrypt',
      privateKeyID,
      data,
    });
  }

  put(privateKey: PrivateKey, privateKeyID?: PrivateKeyID): Promise<KeyManagerResult> {
    if (!privateKeyID) privateKeyID = this.getNextID();
    return this.doJob<WorkerPutJob>({
      action: 'put',
      privateKeyID,
      data: privateKey,
    });
  }
}
