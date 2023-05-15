import type {
  ExportSessionResult,
  ImportSessionRequest,
  ImportSessionResult,
} from '../../../../shared/interfaces/payloads';
import type { Action, Request, Result } from '../../../../shared/types';
import type { ISessionNS } from '../../../shared/interfaces/namespaces';

export class WorkerSessionNS implements ISessionNS {
  constructor(private readonly postJob: <A extends Action>(payload: Request<A>) => Promise<Result<A>>) {}

  async destroy(): Promise<void> {
    await this.postJob({ action: 'destroySession' });
  }

  async export(): Promise<ExportSessionResult> {
    return (await this.postJob({ action: 'exportSession' })).payload;
  }

  async import<T extends boolean>(payload: ImportSessionRequest<T>): Promise<ImportSessionResult<T>> {
    const importResult = (await this.postJob({ action: 'importSession', payload })).payload;

    return (
      payload.reexport
        ? {
            ...importResult,
            ...(await this.export()),
            reexported: true,
          }
        : importResult
    ) as ImportSessionResult<T>;
  }
}
