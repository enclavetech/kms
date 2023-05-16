import type { ImportKeyRequest, ImportKeysResult } from '../../../shared/interfaces/payloads';
import { NS } from './ns';
export declare class KeysNS extends NS {
    import(...requests: ImportKeyRequest[]): Promise<ImportKeysResult[]>;
}
