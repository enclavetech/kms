import type * as Payload from '../interfaces/payloads';
import type { Action, CompletedJob, Result } from '../types';
import { KMS } from './kms';

export abstract class KmsWorkerCore extends KMS {
  protected abstract readonly worker: Worker;
  private readonly pendingJobs: Record<number, (result: Result<Action>) => void> = {};
  private jobCounter = 0;

  protected handleCompletedJob(event: MessageEvent<CompletedJob<Action>>) {
    const { jobID, ...result } = event.data;

    const callback = this.pendingJobs[jobID];

    if (!callback) {
      return console.warn(
        `Enclave KMS: Job [${jobID}]: finished with status: ${JSON.stringify({
          ok: event.data.ok,
        })} but no callback found.`,
      );
    }

    callback(result);
    delete this.pendingJobs[jobID];
  }

  private postJob<A extends Action>(action: A, payload?: unknown): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
      const jobID = this.jobCounter++;
      this.pendingJobs[jobID] = function (result) {
        result.ok ? resolve(result.payload) : reject(result.error);
      };
      this.worker.postMessage({ action, jobID, payload });
    });
  }

  asymmetricDecrypt(request: Payload.CryptPayload): Promise<Payload.DecryptResult> {
    return this.postJob('asymmetricDecrypt', request) as Promise<Payload.DecryptResult>;
  }

  asymmetricEncrypt(request: Payload.CryptPayload): Promise<Payload.CryptPayload> {
    return this.postJob('asymmetricEncrypt', request) as Promise<Payload.CryptPayload>;
  }

  destroySession(): Promise<void> {
    return this.postJob('destroySession') as Promise<void>;
  }

  exportSession(): Promise<Payload.ExportSessionResult> {
    return this.postJob('exportSession') as Promise<Payload.ExportSessionResult>;
  }

  hybridDecrypt(request: Payload.HybridDecryptRequest): Promise<Payload.DecryptResult> {
    return this.postJob('hybridDecrypt', request) as Promise<Payload.DecryptResult>;
  }

  hybridEncrypt(request: Payload.CryptPayload): Promise<Payload.HybridEncryptResult> {
    return this.postJob('hybridEncrypt', request) as Promise<Payload.HybridEncryptResult>;
  }

  importPrivateKeys(...requests: Payload.ImportPrivateKeyRequest[]): Promise<Payload.ImportPrivateKeyResult[]> {
    return Promise.all(
      requests.map((request) => this.postJob('importPrivateKey', request) as Promise<Payload.ImportPrivateKeyResult>),
    );
  }

  async importSession<T extends boolean>(
    request: Payload.ImportSessionRequest<T>,
  ): Promise<Payload.ImportSessionResult<T>> {
    const importResult = (await this.postJob('importSession', request)) as Payload.ImportSessionResult<false>;

    return (
      request.reexport
        ? {
            ...importResult,
            reexported: true,
            ...((await this.postJob('exportSession')) as Payload.ExportSessionResult),
          }
        : importResult
    ) as Payload.ImportSessionResult<T>;
  }

  reencryptSessionKey(request: Payload.ReencryptSessionKeyRequest): Promise<Payload.CryptPayload> {
    return this.postJob('reencryptSessionKey', request) as Promise<Payload.CryptPayload>;
  }
}
