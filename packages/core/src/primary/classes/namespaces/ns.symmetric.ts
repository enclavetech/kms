import type { CryptResult, SymmetricCryptPayload } from '../../../shared/interfaces/payloads';
import { NS } from './ns';

export class SymmetricNS extends NS {
  async decrypt(payload: SymmetricCryptPayload): Promise<CryptResult> {
    return (await this.postJobSingle({ action: 'symmetricDecrypt', payload })).payload;
  }

  async encrypt(payload: SymmetricCryptPayload): Promise<CryptResult> {
    return (await this.postJobSingle({ action: 'symmetricEncrypt', payload })).payload;
  }
}
