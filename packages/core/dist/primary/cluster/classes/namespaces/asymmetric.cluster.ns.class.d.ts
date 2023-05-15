import type { AsymmetricCryptPayload, CryptResult } from '../../../../shared/interfaces/payloads';
import type { IAsymmetricNS } from '../../../shared/interfaces/namespaces';
import type { KmsWorkerCore } from '../../../worker/classes/kms-worker';
export declare class ClusterAsymmetricNS<T extends KmsWorkerCore> implements IAsymmetricNS {
    private readonly getNextWorker;
    constructor(getNextWorker: () => T);
    decrypt(request: AsymmetricCryptPayload): Promise<CryptResult>;
    encrypt(request: AsymmetricCryptPayload): Promise<AsymmetricCryptPayload>;
}
