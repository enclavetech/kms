import type * as Payloads from '../../shared/interfaces/payloads';
import type { KmsConfig } from '../interfaces/configs/kms-config';
import { KMS } from './kms';
import { KmsWorkerCore } from './kms-worker';
export declare abstract class KmsClusterCore<T extends KmsWorkerCore> extends KMS {
    protected readonly config: KmsConfig;
    protected abstract createWorker(config: KmsConfig): T;
    private readonly cluster;
    private currentWorker;
    constructor(config?: KmsConfig);
    private getNextWorker;
    asymmetricDecrypt(request: Payloads.CryptPayload): Promise<Payloads.DecryptResult>;
    asymmetricEncrypt(request: Payloads.CryptPayload): Promise<Payloads.CryptPayload>;
    destroySession(): Promise<void>;
    exportSession(): Promise<Payloads.ExportSessionResult>;
    hybridDecrypt(request: Payloads.HybridDecryptRequest): Promise<Payloads.DecryptResult>;
    hybridEncrypt(request: Payloads.CryptPayload): Promise<Payloads.HybridEncryptResult>;
    importPrivateKeys(...request: Payloads.ImportPrivateKeyRequest[]): Promise<Payloads.ImportPrivateKeyResult[]>;
    importSession<T extends boolean>(request: Payloads.ImportSessionRequest<T>): Promise<Payloads.ImportSessionResult<T>>;
    reencryptSessionKey(request: Payloads.ReencryptSessionKeyRequest): Promise<Payloads.CryptPayload>;
}
