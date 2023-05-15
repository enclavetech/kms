import type { AsymmetricCryptPayload, CryptResult, HybridDecryptRequest, HybridEncryptResult, ReencryptSessionKeyRequest } from '../../../../shared/interfaces/payloads';
import type { Action, Request, Result } from '../../../../shared/types';
import type { IHybridNS } from '../../../shared/interfaces/namespaces';
export declare class WorkerHybridNS implements IHybridNS {
    private readonly postJob;
    constructor(postJob: <A extends Action>(payload: Request<A>) => Promise<Result<A>>);
    decrypt(payload: HybridDecryptRequest): Promise<CryptResult>;
    encrypt(payload: AsymmetricCryptPayload): Promise<HybridEncryptResult>;
    shareKey(payload: ReencryptSessionKeyRequest): Promise<AsymmetricCryptPayload>;
}
