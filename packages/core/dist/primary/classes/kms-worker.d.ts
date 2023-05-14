import type * as Payloads from '../../shared/interfaces/payloads';
import type { Action, CompletedJob } from '../../shared/types';
import { KMS } from './kms';
export declare abstract class KmsWorkerCore extends KMS {
    protected abstract readonly worker: Worker;
    private readonly pendingJobs;
    private jobCounter;
    protected handleCompletedJob(event: MessageEvent<CompletedJob<Action>>): void;
    private postJob;
    asymmetricDecrypt(payload: Payloads.CryptPayload): Promise<Payloads.DecryptResult>;
    asymmetricEncrypt(payload: Payloads.CryptPayload): Promise<Payloads.CryptPayload>;
    destroySession(): Promise<void>;
    exportSession(): Promise<Payloads.ExportSessionResult>;
    hybridDecrypt(payload: Payloads.HybridDecryptRequest): Promise<Payloads.DecryptResult>;
    hybridEncrypt(payload: Payloads.CryptPayload): Promise<Payloads.HybridEncryptResult>;
    importKeys(...payloads: Payloads.ImportKeyRequest[]): Promise<Payloads.ImportKeysResult[]>;
    importSession<T extends boolean>(payload: Payloads.ImportSessionRequest<T>): Promise<Payloads.ImportSessionResult<T>>;
    reencryptSessionKey(payload: Payloads.ReencryptSessionKeyRequest): Promise<Payloads.CryptPayload>;
}
