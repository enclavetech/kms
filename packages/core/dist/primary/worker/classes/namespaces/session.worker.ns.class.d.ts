import type { ExportSessionResult, ImportSessionRequest, ImportSessionResult } from '../../../../shared/interfaces/payloads';
import type { Action, Request, Result } from '../../../../shared/types';
import type { ISessionNS } from '../../../shared/interfaces/namespaces';
export declare class WorkerSessionNS implements ISessionNS {
    private readonly postJob;
    constructor(postJob: <A extends Action>(payload: Request<A>) => Promise<Result<A>>);
    destroy(): Promise<void>;
    export(): Promise<ExportSessionResult>;
    import<T extends boolean>(payload: ImportSessionRequest<T>): Promise<ImportSessionResult<T>>;
}
