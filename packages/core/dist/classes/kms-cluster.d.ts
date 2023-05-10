import type { KmsConfig } from '../interfaces/configs/kms-config';
import type { CryptOpPayloadData } from '../interfaces/payload-data/crypt-op';
import type { HybridDecryptRequestPayloadData } from '../interfaces/payload-data/hybrid-decrypt-request';
import type { KeyImportRequestPayloadData } from '../interfaces/payload-data/key-import-request';
import type { DecryptResult, EncryptResult, HybridDecryptResult, HybridEncryptResult, KeyImportResult, SessionDestroyResult, SessionExportResult, SessionImportResult } from '../types/result';
import { KMS } from './kms';
import { KmsWorkerCore } from './kms-worker';
export declare abstract class KmsClusterCore<T extends KmsWorkerCore> extends KMS {
    protected readonly config: KmsConfig;
    protected abstract createWorker(config: KmsConfig): T;
    private readonly cluster;
    private currentWorker;
    constructor(config?: KmsConfig);
    private getNextWorker;
    importKey(keyImportRequest: KeyImportRequestPayloadData): Promise<KeyImportResult>;
    destroySession(): Promise<SessionDestroyResult>;
    exportSession(): Promise<SessionExportResult>;
    importSession(sessionPayload: string): Promise<SessionImportResult>;
    decrypt(decryptRequest: CryptOpPayloadData): Promise<DecryptResult>;
    encrypt(encryptRequest: CryptOpPayloadData): Promise<EncryptResult>;
    hybridDecrypt(hybridDecryptRequest: HybridDecryptRequestPayloadData): Promise<HybridDecryptResult>;
    hybridEncrypt(hybridEncryptRequest: CryptOpPayloadData): Promise<HybridEncryptResult>;
}
