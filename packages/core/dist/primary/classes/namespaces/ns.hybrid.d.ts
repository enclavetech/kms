import type { AsymmetricCryptPayload, CryptResult, HybridDecryptRequest, HybridEncryptResult, HybridShareKeyRequest } from '../../../shared/interfaces/payloads';
import { NS } from './ns';
export declare class HybridNS extends NS {
    decrypt(payload: HybridDecryptRequest): Promise<CryptResult>;
    encrypt(payload: AsymmetricCryptPayload): Promise<HybridEncryptResult>;
    shareKey(payload: HybridShareKeyRequest): Promise<AsymmetricCryptPayload>;
}
