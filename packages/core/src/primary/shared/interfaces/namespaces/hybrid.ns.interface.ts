import type {
  AsymmetricCryptPayload,
  CryptResult,
  HybridDecryptRequest,
  HybridEncryptResult,
  ReencryptSessionKeyRequest,
} from '../../../../shared/interfaces/payloads';

import type { ICrypter } from '../../../shared/interfaces/crypter.interface';

export interface IHybridNS extends ICrypter {
  /** Decrypt a payload with an asymetrically encrypted session key. */
  decrypt(request: HybridDecryptRequest): Promise<CryptResult>;

  /** Encrypt a payload with an asymmetrically encrypted session key. */
  encrypt(request: AsymmetricCryptPayload): Promise<HybridEncryptResult>;

  /** Re-encrypt an encrypted session key with another key pair. */
  shareKey(request: ReencryptSessionKeyRequest): Promise<AsymmetricCryptPayload>;
}
