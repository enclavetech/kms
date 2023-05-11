import type { CryptOpPayloadData } from '../interfaces/payload-data/crypt-op';
import type { HybridDecryptRequestPayloadData } from '../interfaces/payload-data/hybrid-decrypt-request';
import type { KeyImportRequestPayloadData } from '../interfaces/payload-data/key-import-request';
import type { KmsAction } from '../types/action';
import type { KmsResponse } from '../types/response';
import type { DecryptResult, EncryptResult, HybridDecryptResult, HybridEncryptResult, KeyImportResult, SessionDestroyResult, SessionExportResult, SessionImportResult } from '../types/result';
import { KMS } from './kms';
export declare abstract class KmsWorkerCore extends KMS {
    protected abstract readonly worker: Worker;
    private readonly pendingJobs;
    private jobCounter;
    protected onmessage(event: MessageEvent<KmsResponse<KmsAction, never>>): void;
    private postJob;
    importKey(payload: KeyImportRequestPayloadData): Promise<KeyImportResult>;
    destroySession(): Promise<SessionDestroyResult>;
    exportSession(): Promise<SessionExportResult>;
    importSession(payload: string): Promise<SessionImportResult>;
    decrypt(payload: CryptOpPayloadData): Promise<DecryptResult>;
    encrypt(payload: CryptOpPayloadData): Promise<EncryptResult>;
    hybridDecrypt(payload: HybridDecryptRequestPayloadData): Promise<HybridDecryptResult>;
    hybridEncrypt(payload: CryptOpPayloadData): Promise<HybridEncryptResult>;
}
