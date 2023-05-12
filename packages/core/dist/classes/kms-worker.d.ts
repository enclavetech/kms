import type * as Payload from '../interfaces/payloads';
import type { Action, CompletedJob } from '../types';
import { KMS } from './kms';
export declare abstract class KmsWorkerCore extends KMS {
    protected abstract readonly worker: Worker;
    private readonly pendingJobs;
    private jobCounter;
    protected handleCompletedJob(event: MessageEvent<CompletedJob<Action, never>>): void;
    private postJob;
    asymmetricDecrypt(request: Payload.CryptPayload): Promise<Payload.DecryptResult>;
    asymmetricEncrypt(request: Payload.CryptPayload): Promise<Payload.CryptPayload>;
    destroySession(): Promise<void>;
    exportSession(): Promise<Payload.ExportSessionResult>;
    hybridDecrypt(request: Payload.HybridDecryptRequest): Promise<Payload.DecryptResult>;
    hybridEncrypt(request: Payload.CryptPayload): Promise<Payload.HybridEncryptResult>;
    importPrivateKey(request: Payload.ImportPrivateKeyRequest): Promise<Payload.ImportPrivateKeyResult>;
    importSession(request: Payload.ImportSessionRequest): Promise<Payload.ImportSessionResult>;
    reencryptSessionKey(request: Payload.ReencryptSessionKeyRequest): Promise<Payload.CryptPayload>;
}
