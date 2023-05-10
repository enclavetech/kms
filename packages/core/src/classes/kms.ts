import type { KmsConfig } from '../interfaces/configs/kms-config';
import type { CryptOpPayloadData } from '../interfaces/payload-data/crypt-op';
import type { HybridDecryptRequestPayloadData } from '../interfaces/payload-data/hybrid-decrypt-request';
import type { KeyImportRequestPayloadData } from '../interfaces/payload-data/key-import-request';
import type * as Result from '../types/result';

export abstract class KMS {
  protected abstract readonly config: KmsConfig;

  public abstract importKey(
    keyImportRequest: KeyImportRequestPayloadData,
  ): Promise<Result.KeyImportResult>;

  public abstract destroySession(): Promise<Result.SessionDestroyResult>;
  public abstract exportSession(): Promise<Result.SessionExportResult>;
  public abstract importSession(sessionPayload: string): Promise<Result.SessionImportResult>;

  public abstract decrypt(decryptRequest: CryptOpPayloadData): Promise<Result.DecryptResult>;
  public abstract encrypt(encryptRequest: CryptOpPayloadData): Promise<Result.EncryptResult>;

  public abstract hybridDecrypt(
    hybridDecryptRequest: HybridDecryptRequestPayloadData,
  ): Promise<Result.HybridDecryptResult>;

  public abstract hybridEncrypt(
    hybridEncryptRequest: CryptOpPayloadData,
  ): Promise<Result.HybridEncryptResult>;
}
