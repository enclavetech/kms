import type {
  AsymmetricCryptPayload,
  CryptResult,
  HybridDecryptRequest,
  HybridEncryptResult,
  ReencryptSessionKeyRequest,
} from '../../../shared/interfaces/payloads';
import { NS } from './ns';

export class HybridNS extends NS {
  async decrypt(payload: HybridDecryptRequest): Promise<CryptResult> {
    return (await this.postJobSingle({ action: 'hybridDecrypt', payload })).payload;
  }

  async encrypt(payload: AsymmetricCryptPayload): Promise<HybridEncryptResult> {
    return (await this.postJobSingle({ action: 'hybridEncrypt', payload })).payload;
  }

  async shareKey(payload: ReencryptSessionKeyRequest): Promise<AsymmetricCryptPayload> {
    return (await this.postJobSingle({ action: 'reencryptSessionKey', payload })).payload;
  }
}
