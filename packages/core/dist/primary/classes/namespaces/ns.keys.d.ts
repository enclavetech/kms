import type { EncryptPrivateKeyRequest, EncryptPrivateKeyResult, GenerateKeyPairRequest, GenerateKeyPairResult, ImportKeyRequest, ImportKeysResult } from '../../../shared/interfaces/payloads';
import { NS } from './ns';
export declare class KeysNS extends NS {
    encryptPrivateKey(payload: EncryptPrivateKeyRequest): Promise<EncryptPrivateKeyResult>;
    generateKeyPair(payload?: GenerateKeyPairRequest): Promise<GenerateKeyPairResult>;
    import(...requests: ImportKeyRequest[]): Promise<ImportKeysResult[]>;
}
