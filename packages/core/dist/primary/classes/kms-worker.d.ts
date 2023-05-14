import type * as Payloads from '../../shared/interfaces/payloads';
import type { Action, CompletedJob } from '../../shared/types';
import type { KMS } from '../interfaces/kms';
export declare abstract class KmsWorkerCore implements KMS {
    protected abstract readonly worker: Worker;
    private readonly pendingJobs;
    private jobCounter;
    protected handleCompletedJob(event: MessageEvent<CompletedJob<Action>>): void;
    private postJob;
    asymmetricDecrypt(payload: Payloads.AsymmetricCryptPayload): Promise<Payloads.CryptResult>;
    asymmetricEncrypt(payload: Payloads.AsymmetricCryptPayload): Promise<Payloads.AsymmetricCryptPayload>;
    destroySession(): Promise<void>;
    exportSession(): Promise<Payloads.ExportSessionResult>;
    hybridDecrypt(payload: Payloads.HybridDecryptRequest): Promise<Payloads.CryptResult>;
    hybridEncrypt(payload: Payloads.AsymmetricCryptPayload): Promise<Payloads.HybridEncryptResult>;
    importKeys(...payloads: Payloads.ImportKeyRequest[]): Promise<Payloads.ImportKeysResult[]>;
    importSession<T extends boolean>(payload: Payloads.ImportSessionRequest<T>): Promise<Payloads.ImportSessionResult<T>>;
    reencryptSessionKey(payload: Payloads.ReencryptSessionKeyRequest): Promise<Payloads.AsymmetricCryptPayload>;
    symmetricDecrypt(payload: Payloads.SymmetricCryptPayload): Promise<Payloads.CryptResult>;
    symmetricEncrypt(payload: Payloads.SymmetricCryptPayload): Promise<Payloads.CryptResult>;
}
