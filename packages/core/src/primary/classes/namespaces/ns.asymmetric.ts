import type { AsymmetricCryptPayload, CryptResult } from '../../../shared/interfaces/payloads';
import { NS } from './ns';

export class AsymmetricNS extends NS {
  async decrypt(payload: AsymmetricCryptPayload): Promise<CryptResult> {
    return (await this.postJobSingle({ action: 'asymmetricDecrypt', payload })).payload;
  }

  async encrypt(payload: AsymmetricCryptPayload): Promise<AsymmetricCryptPayload> {
    return (await this.postJobSingle({ action: 'asymmetricEncrypt', payload })).payload;
  }
}
