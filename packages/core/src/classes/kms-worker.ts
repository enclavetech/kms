import type { CryptOpPayloadData } from '../interfaces/payload-data/crypt-op';
import type { HybridDecryptRequestPayloadData } from '../interfaces/payload-data/hybrid-decrypt-request';
import type { KeyImportRequestPayloadData } from '../interfaces/payload-data/key-import-request';
import type { KmsAction } from '../types/action';
import type { KmsCallback } from '../types/callback';
import type { KmsPayload } from '../types/payload';
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

  private postJob<Action extends KmsAction, Result extends KmsResult<Action, unknown>, Data = void>(
    request: KmsPayload<Action, Data>,
  ): Promise<Result> {
    return new Promise<Result>((resolve, reject) => {
      const jobID = this.jobCounter++;
      this.pendingJobs[jobID] = function (result) {
        result.ok ? resolve(result as Result) : reject(result);
      };
      this.worker.postMessage({ ...request, jobID });
    });
  }

  public importKey(keyImportRequest: KeyImportRequestPayloadData): Promise<KeyImportResult> {
    return this.postJob<'importKey', KeyImportResult, KeyImportRequestPayloadData>({
      action: 'importKey',
      payload: keyImportRequest,
    });
  }

  public destroySession(): Promise<SessionDestroyResult> {
    return this.postJob<'destroySession', SessionDestroyResult>({
      action: 'destroySession',
      payload: undefined,
    });
  }

  public exportSession(): Promise<SessionExportResult> {
    return this.postJob<'exportSession', SessionExportResult>({
      action: 'exportSession',
      payload: undefined,
    });
  }

  public importSession(payload: string): Promise<SessionImportResult> {
    return this.postJob<'importSession', SessionImportResult, string>({
      action: 'importSession',
      payload,
    });
  }

  public decrypt(decryptRequest: CryptOpPayloadData): Promise<DecryptResult> {
    return this.postJob<'decrypt', DecryptResult, CryptOpPayloadData>({
      action: 'decrypt',
      payload: decryptRequest,
    });
  }

  public encrypt(encryptRequest: CryptOpPayloadData): Promise<EncryptResult> {
    return this.postJob<'encrypt', EncryptResult, CryptOpPayloadData>({
      action: 'encrypt',
      payload: encryptRequest,
    });
  }

  public hybridDecrypt(
    hybridDecryptRequest: HybridDecryptRequestPayloadData,
  ): Promise<HybridDecryptResult> {
    return this.postJob<'hybridDecrypt', HybridDecryptResult, HybridDecryptRequestPayloadData>({
      action: 'hybridDecrypt',
      payload: hybridDecryptRequest,
    });
  }

  public hybridEncrypt(hybridEncryptRequest: CryptOpPayloadData): Promise<HybridEncryptResult> {
    return this.postJob<'hybridEncrypt', HybridEncryptResult, CryptOpPayloadData>({
      action: 'hybridEncrypt',
      payload: hybridEncryptRequest,
    });
  }
}
