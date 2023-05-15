import type { ImportKeyRequest, ImportKeysResult } from '../../../../shared/interfaces/payloads';
export interface IKeysNS {
    /**
     * Import keys into the KMS.
     * @param requests One or more keys to import.
     */
    import(...requests: ImportKeyRequest[]): Promise<ImportKeysResult[]>;
}
