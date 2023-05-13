import type { KmsConfig } from '../interfaces/configs/kms-config';
import type * as Payload from '../interfaces/payloads';
import { KMS } from './kms';
import { KmsWorkerCore } from './kms-worker';
export declare abstract class KmsClusterCore<T extends KmsWorkerCore> extends KMS {
    protected readonly config: KmsConfig;
    protected abstract createWorker(config: KmsConfig): T;
    private readonly cluster;
    private currentWorker;
    constructor(config?: KmsConfig);
    private getNextWorker;
    asymmetricDecrypt(request: Payload.CryptPayload): Promise<Payload.DecryptResult>;
    asymmetricEncrypt(request: Payload.CryptPayload): Promise<Payload.CryptPayload>;
    destroySession(): Promise<void>;
    exportSession(): Promise<Payload.ExportSessionResult>;
    hybridDecrypt(request: Payload.HybridDecryptRequest): Promise<Payload.DecryptResult>;
    hybridEncrypt(request: Payload.CryptPayload): Promise<Payload.HybridEncryptResult>;
    importPrivateKeys(...request: Payload.ImportPrivateKeyRequest[]): Promise<Payload.ImportPrivateKeyResult[]>;
    importSession<T extends boolean>(request: Payload.ImportSessionRequest<T>): Promise<Payload.ImportSessionResult<T>>;
    reencryptSessionKey(request: Payload.ReencryptSessionKeyRequest): Promise<Payload.CryptPayload>;
}
