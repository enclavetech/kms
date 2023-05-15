import type { AsymmetricCryptPayload, CryptResult } from '../../../../shared/interfaces/payloads';
import type { ICrypter } from '../../../shared/interfaces/crypter.interface';
export interface IAsymmetricNS extends ICrypter {
    /** Decrypt a payload with a private key. */
    decrypt(request: AsymmetricCryptPayload): Promise<CryptResult>;
    /** Encrypt a payload with a public key or key pair. */
    encrypt(request: AsymmetricCryptPayload): Promise<AsymmetricCryptPayload>;
}
