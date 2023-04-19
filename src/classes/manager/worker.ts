import type { PrivateKey } from 'openpgp';
import { DEFAULT_CONFIG } from '../../constants';
import type {
  KeyManagerConfig,
  WorkerResponse,
  KeyManagerRequest,
  KeyManagerFailResult,
  KeyManagerSuccessResult,
  KeyManagerDecryptResult,
  KeyManagerDecryptRequest,
  KeyManagerEncryptRequest,
  KeyManagerImportKeyRequest,
  KeyManagerEncryptResult,
  KeyManagerImportKeyResult,
  KeyManagerExportSessionResult,
  KeyManagerImportSessionResult,
  KeyManagerExportSessionRequest,
  KeyManagerImportSessionRequest,
  KeyManagerDestroySessionResult,
  KeyManagerDestroySessionRequest,
} from '../../interfaces';
import type { KeyManagerAction, KeyManagerCallback, PrivateKeyID } from '../../types';
import { KeyManager } from './manager';

export class KeyWorkerManager extends KeyManager {
  private readonly worker = new Worker(new URL('../../workers/key.worker.js?worker', import.meta.url), {
    type: 'module',
  });

  private readonly pendingJobs = new Map<number, KeyManagerCallback<KeyManagerAction>>();
  private jobCounter = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(protected readonly config: KeyManagerConfig = DEFAULT_CONFIG) {
    super();

    this.worker.onmessage = (event: MessageEvent<WorkerResponse<KeyManagerAction>>) => {
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

  private doJob<
    Action extends KeyManagerAction,
    Request extends KeyManagerRequest<Action>,
    Result extends KeyManagerSuccessResult<Action>
  >(request: Request): Promise<Result> {
    return new Promise<Result>((resolve, reject) => {
      const jobID = this.jobCounter++;
      this.pendingJobs.set(jobID, (result) => {
        result.ok ? resolve(result as Result) : reject(result as KeyManagerFailResult<Action>);
      });
      this.worker.postMessage({ ...request, jobID });
    });
  }

  public importKey(
    privateKey: PrivateKey,
    keyID: PrivateKeyID = this.getNextID()
  ): Promise<KeyManagerImportKeyResult> {
    return this.doJob<'importKey', KeyManagerImportKeyRequest, KeyManagerImportKeyResult>({
      action: 'importKey',
      keyID,
      data: privateKey,
    });
  }

  public destroySession(): Promise<KeyManagerDestroySessionResult> {
    return this.doJob<'destroySession', KeyManagerDestroySessionRequest, KeyManagerDestroySessionResult>({
      action: 'destroySession',
    });
  }

  public exportSession(): Promise<KeyManagerExportSessionResult> {
    return this.doJob<'exportSession', KeyManagerExportSessionRequest, KeyManagerExportSessionResult>({
      action: 'exportSession',
    });
  }

  public importSession(data: string): Promise<KeyManagerImportSessionResult> {
    return this.doJob<'importSession', KeyManagerImportSessionRequest, KeyManagerImportSessionResult>({
      action: 'importSession',
      data,
    });
  }

  public decrypt(data: string, keyID: PrivateKeyID): Promise<KeyManagerDecryptResult> {
    return this.doJob<'decrypt', KeyManagerDecryptRequest, KeyManagerDecryptResult>({
      action: 'decrypt',
      keyID,
      data,
    });
  }

  public encrypt(data: string, keyID: PrivateKeyID): Promise<KeyManagerEncryptResult> {
    return this.doJob<'encrypt', KeyManagerEncryptRequest, KeyManagerEncryptResult>({
      action: 'encrypt',
      keyID,
      data,
    });
  }
}
