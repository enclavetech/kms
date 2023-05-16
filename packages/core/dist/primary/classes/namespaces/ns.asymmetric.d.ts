import type { AsymmetricCryptPayload, CryptResult } from '../../../shared/interfaces/payloads';
import { NS } from './ns';
export declare class AsymmetricNS extends NS {
    decrypt(payload: AsymmetricCryptPayload): Promise<CryptResult>;
    encrypt(payload: AsymmetricCryptPayload): Promise<AsymmetricCryptPayload>;
}
