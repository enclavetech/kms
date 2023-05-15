import type { ImportKeyRequest, ImportKeysResult } from '../../../../shared/interfaces/payloads';
import type { KmsWorkerCore } from '../../../worker/classes/kms-worker';
import type { IKeysNS } from '../../../shared/interfaces/namespaces';
export declare class ClusterKeysNS<T extends KmsWorkerCore> implements IKeysNS {
    private readonly doForAll;
    constructor(doForAll: <fnReturn extends Promise<unknown>>(fn: (worker: T) => fnReturn) => Promise<Awaited<fnReturn>>);
    import(...request: ImportKeyRequest[]): Promise<ImportKeysResult[]>;
}
