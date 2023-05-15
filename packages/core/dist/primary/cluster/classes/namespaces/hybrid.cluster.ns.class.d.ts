import type { AsymmetricCryptPayload, CryptResult, HybridDecryptRequest, HybridEncryptResult, ReencryptSessionKeyRequest } from '../../../../shared/interfaces/payloads';
import type { KmsWorkerCore } from '../../../worker/classes/kms-worker';
import type { IHybridNS } from '../../../shared/interfaces/namespaces';
export declare class ClusterHybridNS<T extends KmsWorkerCore> implements IHybridNS {
    private readonly getNextWorker;
    constructor(getNextWorker: () => T);
    decrypt(request: HybridDecryptRequest): Promise<CryptResult>;
    encrypt(request: AsymmetricCryptPayload): Promise<HybridEncryptResult>;
    shareKey(request: ReencryptSessionKeyRequest): Promise<AsymmetricCryptPayload>;
}
