import type { KeyManagerAction, WorkerJobID } from '../../types';
import type { IKeyIdMixin } from '../mixins';
import type { KeyManagerDecryptRequest, KeyManagerEncryptRequest, KeyManagerExportSessionRequest, KeyManagerImportKeyRequest, KeyManagerImportSessionRequest, KeyManagerRequest } from '../requests';
/**
 * Base interface for a worker job request.
 * These are used internally within the package for communication with workers.
 */
export interface WorkerJob<Action extends KeyManagerAction> extends KeyManagerRequest<Action> {
    jobID: WorkerJobID;
}
export type WorkerImportKeyJob = WorkerJob<'importKey'> & KeyManagerImportKeyRequest & IKeyIdMixin;
export type WorkerExportSessionJob = WorkerJob<'exportSession'> & KeyManagerExportSessionRequest;
export type WorkerImportSessionJob = WorkerJob<'importSession'> & KeyManagerImportSessionRequest;
export type WorkerDecryptJob = WorkerJob<'decrypt'> & KeyManagerDecryptRequest;
export type WorkerEncryptJob = WorkerJob<'encrypt'> & KeyManagerEncryptRequest;
