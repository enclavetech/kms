import type * as Payloads from '../../shared/interfaces/payloads';
import type { KMS, KmsConfig } from '../interfaces';
import { KmsWorkerCore } from './kms-worker';
export declare abstract class KmsClusterCore<T extends KmsWorkerCore> implements KMS {
    protected abstract createWorker(): T;
    private readonly cluster;
    private currentWorker;
    constructor(config?: KmsConfig);
    private getNextWorker;
    asymmetricDecrypt(request: Payloads.AsymmetricCryptPayload): Promise<Payloads.CryptResult>;
    asymmetricEncrypt(request: Payloads.AsymmetricCryptPayload): Promise<Payloads.AsymmetricCryptPayload>;
    destroySession(): Promise<void>;
    exportSession(): Promise<Payloads.ExportSessionResult>;
    hybridDecrypt(request: Payloads.HybridDecryptRequest): Promise<Payloads.CryptResult>;
    hybridEncrypt(request: Payloads.AsymmetricCryptPayload): Promise<Payloads.HybridEncryptResult>;
    importKeys(...request: Payloads.ImportKeyRequest[]): Promise<Payloads.ImportKeysResult[]>;
    importSession<T extends boolean>(request: Payloads.ImportSessionRequest<T>): Promise<Payloads.ImportSessionResult<T>>;
    reencryptSessionKey(request: Payloads.ReencryptSessionKeyRequest): Promise<Payloads.AsymmetricCryptPayload>;
    symmetricDecrypt(request: Payloads.SymmetricCryptPayload): Promise<Payloads.CryptResult>;
    symmetricEncrypt(request: Payloads.SymmetricCryptPayload): Promise<Payloads.CryptResult>;
}
