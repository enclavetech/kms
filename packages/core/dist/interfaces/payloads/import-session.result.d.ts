export interface ImportSessionResult {
    /** An array of the IDs of the imported keys. */
    importedKeyIDs: string[];
    /** An encrypted KMS session export payload string. */
    sessionPayload?: string;
}
