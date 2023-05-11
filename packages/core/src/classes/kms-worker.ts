import type { CryptOpPayloadData } from '../interfaces/payload-data/crypt-op';
import type { HybridDecryptRequestPayloadData } from '../interfaces/payload-data/hybrid-decrypt-request';
import type { KeyImportRequestPayloadData } from '../interfaces/payload-data/key-import-request';
import type { KmsAction } from '../types/action';
import type { KmsCallback } from '../types/callback';
import type { KmsResponse } from '../types/response';
import type {
  DecryptResult,
  EncryptResult,
  HybridDecryptResult,
  HybridEncryptResult,
  KeyImportResult,
  KmsResult,
  SessionDestroyResult,
  SessionExportResult,
  SessionImportResult,
} from '../types/result';
import { KMS } from './kms';

export abstract class KmsWorkerCore extends KMS {
  protected abstract readonly worker: Worker;
  private readonly pendingJobs: Record<number, KmsCallback<KmsAction, unknown>> = {};
  private jobCounter = 0;

  protected onmessage(event: MessageEvent<KmsResponse<KmsAction, never>>) {
    const response = event.data;
    const { jobID, ...result } = response;

    const callback = this.pendingJobs[jobID];

    if (!callback) {
      const { ok } = response;
      return console.warn(
        `Enclave KMS: Job [${jobID}]: finished with status: ${JSON.stringify({
          ok,
        })} but no callback found.`,
      );
    }

    callback(result);
    delete this.pendingJobs[jobID];
  }

  private postJob<A extends KmsAction>(
    action: A,
    payload?: unknown,
  ): Promise<KmsResult<A, unknown>> {
    return new Promise<KmsResult<A, unknown>>((resolve, reject) => {
      const jobID = this.jobCounter++;
      this.pendingJobs[jobID] = function (result) {
        result.ok ? resolve(result as KmsResult<A, unknown>) : reject(result);
      };
      this.worker.postMessage({ action, jobID, payload });
    });
  }

  public importKey(payload: KeyImportRequestPayloadData) {
    return this.postJob('importKey', payload) as Promise<KeyImportResult>;
  }

  public destroySession() {
    return this.postJob('destroySession') as Promise<SessionDestroyResult>;
  }

  public exportSession() {
    return this.postJob('exportSession') as Promise<SessionExportResult>;
  }

  public importSession(payload: string) {
    return this.postJob('importSession', payload) as Promise<SessionImportResult>;
  }

  public decrypt(payload: CryptOpPayloadData) {
    return this.postJob('decrypt', payload) as Promise<DecryptResult>;
  }

  public encrypt(payload: CryptOpPayloadData) {
    return this.postJob('encrypt', payload) as Promise<EncryptResult>;
  }

  public hybridDecrypt(payload: HybridDecryptRequestPayloadData) {
    return this.postJob('hybridDecrypt', payload) as Promise<HybridDecryptResult>;
  }

  public hybridEncrypt(payload: CryptOpPayloadData) {
    return this.postJob('hybridEncrypt', payload) as Promise<HybridEncryptResult>;
  }
}
