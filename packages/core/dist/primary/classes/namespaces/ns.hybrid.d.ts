import type { AsymmetricCryptPayload, CryptResult, HybridDecryptRequest, HybridEncryptResult, ReencryptSessionKeyRequest } from '../../../shared/interfaces/payloads';
import { NS } from './ns';
export declare class HybridNS extends NS {
    decrypt(payload: HybridDecryptRequest): Promise<CryptResult>;
    encrypt(payload: AsymmetricCryptPayload): Promise<HybridEncryptResult>;
    shareKey(payload: ReencryptSessionKeyRequest): Promise<AsymmetricCryptPayload>;
}
