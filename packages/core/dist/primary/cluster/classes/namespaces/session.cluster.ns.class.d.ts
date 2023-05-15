import type { ExportSessionResult, ImportSessionRequest, ImportSessionResult } from '../../../../shared/interfaces/payloads';
import type { KmsWorkerCore } from '../../../worker/classes/kms-worker';
import type { ISessionNS } from '../../../shared/interfaces/namespaces';
export declare class ClusterSessionNS<T extends KmsWorkerCore> implements ISessionNS {
    private readonly getNextWorker;
    private readonly doForAll;
    constructor(getNextWorker: () => T, doForAll: <fnReturn extends Promise<unknown>>(fn: (worker: T) => fnReturn) => Promise<Awaited<fnReturn>>);
    destroy(): Promise<void>;
    export(): Promise<ExportSessionResult>;
    import<T extends boolean>(request: ImportSessionRequest<T>): Promise<ImportSessionResult<T>>;
}
