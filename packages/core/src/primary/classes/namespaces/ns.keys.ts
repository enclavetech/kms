import type { ImportKeyRequest, ImportKeysResult } from '../../../shared/interfaces/payloads';
import { NS } from './ns';

export class KeysNS extends NS {
  import(...requests: ImportKeyRequest[]): Promise<ImportKeysResult[]> {
    // TODO: if failed for some workers only,
    // send `forgetKey` job to roll operation back and throw error
    // this is a problem as they would be out of sync

    // if failed for ALL workers, just raise a warning about the key being unavailable

    return Promise.all(
      requests.map(async (payload) => (await this.postJobAll({ action: 'importKeyPair', payload }))[0].payload),
    );
  }
}
