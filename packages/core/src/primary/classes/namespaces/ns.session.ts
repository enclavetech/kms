import type {
  ExportSessionResult,
  ImportSessionRequest,
  ImportSessionResult,
} from '../../../shared/interfaces/payloads';
import { NS } from './ns';

export class SessionNS extends NS {
  async destroy(): Promise<void> {
    await this.postJobAll({ action: 'destroySession' });
  }

  async export(): Promise<ExportSessionResult> {
    return (await this.postJobSingle({ action: 'exportSession' })).payload;
  }

  async import<T extends boolean>(request: ImportSessionRequest<T>): Promise<ImportSessionResult<T>> {
    const importSessionResult = (
      await this.postJobAll({
        action: 'importSession',
        payload: { ...request, reexport: false },
      })
    )[0].payload;

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
