import type { AsymmetricCryptPayload, CryptResult } from '../../../../shared/interfaces/payloads';
import type { Action, Request, Result } from '../../../../shared/types';
import type { IAsymmetricNS } from '../../../shared/interfaces/namespaces';
export declare class WorkerAsymmetricNS implements IAsymmetricNS {
    private readonly postJob;
    constructor(postJob: <A extends Action>(payload: Request<A>) => Promise<Result<A>>);
    decrypt(payload: AsymmetricCryptPayload): Promise<CryptResult>;
    encrypt(payload: AsymmetricCryptPayload): Promise<AsymmetricCryptPayload>;
}
