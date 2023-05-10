import type { KmsConfig } from '../interfaces/configs/kms-config';
import type { CryptOpPayloadData } from '../interfaces/payload-data/crypt-op';
import type { HybridDecryptRequestPayloadData } from '../interfaces/payload-data/hybrid-decrypt-request';
import type { KeyImportRequestPayloadData } from '../interfaces/payload-data/key-import-request';
import type * as Result from '../types/result';
export declare abstract class KMS {
    protected abstract readonly config: KmsConfig;
    abstract importKey(keyImportRequest: KeyImportRequestPayloadData): Promise<Result.KeyImportResult>;
    abstract destroySession(): Promise<Result.SessionDestroyResult>;
    abstract exportSession(): Promise<Result.SessionExportResult>;
    abstract importSession(sessionPayload: string): Promise<Result.SessionImportResult>;
    abstract decrypt(decryptRequest: CryptOpPayloadData): Promise<Result.DecryptResult>;
    abstract encrypt(encryptRequest: CryptOpPayloadData): Promise<Result.EncryptResult>;
    abstract hybridDecrypt(hybridDecryptRequest: HybridDecryptRequestPayloadData): Promise<Result.HybridDecryptResult>;
    abstract hybridEncrypt(hybridEncryptRequest: CryptOpPayloadData): Promise<Result.HybridEncryptResult>;
}
