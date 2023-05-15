import type {
  ExportSessionResult,
  ImportSessionRequest,
  ImportSessionResult,
} from '../../../../shared/interfaces/payloads';
import type { KmsWorkerCore } from '../../../worker/classes/kms-worker';
import type { ISessionNS } from '../../../shared/interfaces/namespaces';

export class ClusterSessionNS<T extends KmsWorkerCore> implements ISessionNS {
  constructor(
    private readonly getNextWorker: () => T,
    private readonly doForAll: <fnReturn extends Promise<unknown>>(
      fn: (worker: T) => fnReturn,
    ) => Promise<Awaited<fnReturn>>,
  ) {}

  destroy(): Promise<void> {
    return this.doForAll((worker) => worker.session.destroy());
  }

  export(): Promise<ExportSessionResult> {
    return this.getNextWorker().session.export();
  }

  async import<T extends boolean>(request: ImportSessionRequest<T>): Promise<ImportSessionResult<T>> {
    const importSessionResult = await this.doForAll((worker) => worker.session.import({ ...request, reexport: false }));

    return (
      request.reexport
        ? {
            ...importSessionResult,
            ...(await this.export()),
            reexported: true,
          }
        : importSessionResult
    ) as ImportSessionResult<T>;
  }
}
