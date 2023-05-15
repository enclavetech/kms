import type { ImportKeyRequest, ImportKeysResult } from '../../../../shared/interfaces/payloads';
import type { KmsWorkerCore } from '../../../worker/classes/kms-worker';
import type { IKeysNS } from '../../../shared/interfaces/namespaces';

export class ClusterKeysNS<T extends KmsWorkerCore> implements IKeysNS {
  constructor(
    private readonly doForAll: <fnReturn extends Promise<unknown>>(
      fn: (worker: T) => fnReturn,
    ) => Promise<Awaited<fnReturn>>,
  ) {}

  async import(...request: ImportKeyRequest[]): Promise<ImportKeysResult[]> {
    return this.doForAll((worker) => worker.keys.import(...request));
  }
}
