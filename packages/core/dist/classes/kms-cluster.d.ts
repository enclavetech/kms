import type { KmsConfig } from '../interfaces/configs/kms-config';
import type { CryptOpPayloadData } from '../interfaces/payload-data/crypt-op';
import type { HybridDecryptRequestPayloadData } from '../interfaces/payload-data/hybrid-decrypt-request';
import type { KeyImportRequestPayloadData } from '../interfaces/payload-data/key-import-request';
import type { DecryptResult, EncryptResult, HybridDecryptResult, HybridEncryptResult, KeyImportResult, SessionDestroyResult, SessionExportResult, SessionImportExportResult, SessionImportResult } from '../types/result';
import { KMS } from './kms';
import { KmsWorkerCore } from './kms-worker';
export declare abstract class KmsClusterCore<T extends KmsWorkerCore> extends KMS {
    protected readonly config: KmsConfig;
    protected abstract createWorker(config: KmsConfig): T;
    private readonly cluster;
    private currentWorker;
    constructor(config?: KmsConfig);
    private getNextWorker;
    importKey(payload: KeyImportRequestPayloadData): Promise<KeyImportResult>;
    destroySession(): Promise<SessionDestroyResult>;
    exportSession(): Promise<SessionExportResult>;
    importSession(payload: string): Promise<SessionImportResult>;
    importExportSession(payload: string): Promise<SessionImportExportResult>;
    decrypt(payload: CryptOpPayloadData): Promise<DecryptResult>;
    encrypt(payload: CryptOpPayloadData): Promise<EncryptResult>;
    hybridDecrypt(payload: HybridDecryptRequestPayloadData): Promise<HybridDecryptResult>;
    hybridEncrypt(payload: CryptOpPayloadData): Promise<HybridEncryptResult>;
}
