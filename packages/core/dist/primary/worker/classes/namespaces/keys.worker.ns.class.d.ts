import type { ImportKeyRequest, ImportKeysResult } from '../../../../shared/interfaces/payloads';
import type { Action, Request, Result } from '../../../../shared/types';
import type { IKeysNS } from '../../../shared/interfaces/namespaces';
export declare class WorkerKeysNS implements IKeysNS {
    private readonly postJob;
    constructor(postJob: <A extends Action>(payload: Request<A>) => Promise<Result<A>>);
    import(...payloads: ImportKeyRequest[]): Promise<ImportKeysResult[]>;
}
