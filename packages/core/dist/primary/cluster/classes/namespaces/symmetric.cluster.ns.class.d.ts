import type { CryptResult, SymmetricCryptPayload } from '../../../../shared/interfaces/payloads';
import type { KmsWorkerCore } from '../../../worker/classes/kms-worker';
import type { ISymmetricNS } from '../../../shared/interfaces/namespaces';
export declare class ClusterSymmetricNS<T extends KmsWorkerCore> implements ISymmetricNS {
    private readonly getNextWorker;
    constructor(getNextWorker: () => T);
    decrypt(request: SymmetricCryptPayload): Promise<CryptResult>;
    encrypt(request: SymmetricCryptPayload): Promise<CryptResult>;
}
