import type { ExportSessionResult } from './export-session.result';
export interface ImportSessionResult extends ExportSessionResult {
    /** An array of the IDs of the imported keys. */
    importedKeyIDs: string[];
    /**
     * An encrypted KMS session export payload string.
     * @todo Make its return dependent on an optional `reexportSession` boolean provided in request.
     */
    sessionPayload: string;
}
