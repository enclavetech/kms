import type { CryptResult, SymmetricCryptPayload } from '../../../../shared/interfaces/payloads';
import type { ICrypter } from '../../../shared/interfaces/crypter.interface';
export interface ISymmetricNS extends ICrypter {
    /** Decrypt a payload with a passphrase. */
    decrypt(request: SymmetricCryptPayload): Promise<CryptResult>;
    /** Encrypt a payload with a passphrase. */
    encrypt(request: SymmetricCryptPayload): Promise<CryptResult>;
}
