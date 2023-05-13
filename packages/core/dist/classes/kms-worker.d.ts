import type * as Payload from '../interfaces/payloads';
import type { Action, CompletedJob } from '../types';
import { KMS } from './kms';
export declare abstract class KmsWorkerCore extends KMS {
    protected abstract readonly worker: Worker;
    private readonly pendingJobs;
    private jobCounter;
    protected handleCompletedJob(event: MessageEvent<CompletedJob<Action>>): void;
    private postJob;
    asymmetricDecrypt(request: Payload.CryptPayload): Promise<Payload.DecryptResult>;
    asymmetricEncrypt(request: Payload.CryptPayload): Promise<Payload.CryptPayload>;
    destroySession(): Promise<void>;
    exportSession(): Promise<Payload.ExportSessionResult>;
    hybridDecrypt(request: Payload.HybridDecryptRequest): Promise<Payload.DecryptResult>;
    hybridEncrypt(request: Payload.CryptPayload): Promise<Payload.HybridEncryptResult>;
    importPrivateKeys(...requests: Payload.ImportPrivateKeyRequest[]): Promise<Payload.ImportPrivateKeyResult[]>;
    importSession<T extends boolean>(request: Payload.ImportSessionRequest<T>): Promise<Payload.ImportSessionResult<T>>;
    reencryptSessionKey(request: Payload.ReencryptSessionKeyRequest): Promise<Payload.CryptPayload>;
}
