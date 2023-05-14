import type * as Payloads from '../../shared/interfaces/payloads';
import type { Action, CompletedJob, FailedJob, Request, Result } from '../../shared/types';
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

  private postJob<A extends Action>(payload: Request<A>): Promise<Result<A>> {
    return new Promise<Result<A>>((resolve, reject) => {
      const jobID = this.jobCounter++;
      this.pendingJobs[jobID] = function (result) {
        result.ok ? resolve(result as Result<A>) : reject(result as FailedJob<A>);
      };
      this.worker.postMessage({ jobID, ...payload });
    });
  }

  async asymmetricDecrypt(payload: Payloads.CryptPayload): Promise<Payloads.DecryptResult> {
    return (await this.postJob({ action: 'asymmetricDecrypt', payload })).payload;
  }

  async asymmetricEncrypt(payload: Payloads.CryptPayload): Promise<Payloads.CryptPayload> {
    return (await this.postJob({ action: 'asymmetricEncrypt', payload })).payload;
  }

  async destroySession(): Promise<void> {
    await this.postJob({ action: 'destroySession' });
  }

  async exportSession(): Promise<Payloads.ExportSessionResult> {
    return (await this.postJob({ action: 'exportSession' })).payload;
  }

  async hybridDecrypt(payload: Payloads.HybridDecryptRequest): Promise<Payloads.DecryptResult> {
    return (await this.postJob({ action: 'hybridDecrypt', payload })).payload;
  }

  async hybridEncrypt(payload: Payloads.CryptPayload): Promise<Payloads.HybridEncryptResult> {
    return (await this.postJob({ action: 'hybridEncrypt', payload })).payload;
  }

  importKeys(...payloads: Payloads.ImportKeyRequest[]): Promise<Payloads.ImportKeysResult[]> {
    return Promise.all(
      payloads.map(async (payload) => (await this.postJob({ action: 'importKeyPair', payload })).payload),
    );
  }

  async importSession<T extends boolean>(
    payload: Payloads.ImportSessionRequest<T>,
  ): Promise<Payloads.ImportSessionResult<T>> {
    const importResult = (await this.postJob({ action: 'importSession', payload })).payload;

    return (
      payload.reexport
        ? {
            ...importResult,
            ...(await this.exportSession()),
            reexported: true,
          }
        : importResult
    ) as Payloads.ImportSessionResult<T>;
  }

  async reencryptSessionKey(payload: Payloads.ReencryptSessionKeyRequest): Promise<Payloads.CryptPayload> {
    return (await this.postJob({ action: 'reencryptSessionKey', payload })).payload;
  }
}
