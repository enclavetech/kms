import type { CryptResult, SymmetricCryptPayload } from '../../../shared/interfaces/payloads';
import { NS } from './ns';
export declare class SymmetricNS extends NS {
    decrypt(payload: SymmetricCryptPayload): Promise<CryptResult>;
    encrypt(payload: SymmetricCryptPayload): Promise<CryptResult>;
}
