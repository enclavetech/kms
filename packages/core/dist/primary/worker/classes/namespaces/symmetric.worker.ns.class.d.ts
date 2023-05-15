import type { CryptResult, SymmetricCryptPayload } from '../../../../shared/interfaces/payloads';
import type { Action, Request, Result } from '../../../../shared/types';
import type { ISymmetricNS } from '../../../shared/interfaces/namespaces';
export declare class WorkerSymmetricNS implements ISymmetricNS {
    private readonly postJob;
    constructor(postJob: <A extends Action>(payload: Request<A>) => Promise<Result<A>>);
    decrypt(payload: SymmetricCryptPayload): Promise<CryptResult>;
    encrypt(payload: SymmetricCryptPayload): Promise<CryptResult>;
}
