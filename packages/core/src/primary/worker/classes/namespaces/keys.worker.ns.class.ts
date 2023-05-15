import type { ImportKeyRequest, ImportKeysResult } from '../../../../shared/interfaces/payloads';
import type { Action, Request, Result } from '../../../../shared/types';
import type { IKeysNS } from '../../../shared/interfaces/namespaces';

export class WorkerKeysNS implements IKeysNS {
  constructor(private readonly postJob: <A extends Action>(payload: Request<A>) => Promise<Result<A>>) {}

  import(...payloads: ImportKeyRequest[]): Promise<ImportKeysResult[]> {
    return Promise.all(
      payloads.map(async (payload) => (await this.postJob({ action: 'importKeyPair', payload })).payload),
    );
  }
}
