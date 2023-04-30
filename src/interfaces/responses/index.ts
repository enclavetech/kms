import type { KeyManagerAction, WorkerJobID } from '../../types';
import type {
  KeyManagerDecryptResult,
  KeyManagerDestroySessionResult,
  KeyManagerEncryptResult,
  KeyManagerExportSessionResult,
  KeyManagerHybridDecryptResult,
  KeyManagerHybridEncryptResult,
  KeyManagerImportKeyResult,
  KeyManagerImportSessionResult,
  KeyManagerResult,
} from '../results';

export interface WorkerResponse<Action extends KeyManagerAction> extends KeyManagerResult<Action> {
  jobID: WorkerJobID;
}

export interface WorkerFailResponse<Action extends KeyManagerAction> extends WorkerResponse<Action> {
  error: string;
  ok: false;
}

export interface WorkerSuccessResponse<Action extends KeyManagerAction> extends WorkerResponse<Action> {
  ok: true;
}

// Key I/O
export type WorkerImportKeyResponse = WorkerSuccessResponse<'importKey'> & KeyManagerImportKeyResult;

// Session I/O
export type WorkerDestroySessionResponse = WorkerSuccessResponse<'destroySession'> &
  KeyManagerDestroySessionResult;
export type WorkerExportSessionResponse = WorkerSuccessResponse<'exportSession'> &
  KeyManagerExportSessionResult;
export type WorkerImportSessionResponse = WorkerSuccessResponse<'importSession'> &
  KeyManagerImportSessionResult;

// Encrypt/decrypt
export type WorkerDecryptResponse = WorkerSuccessResponse<'decrypt'> & KeyManagerDecryptResult;
export type WorkerEncryptResponse = WorkerSuccessResponse<'encrypt'> & KeyManagerEncryptResult;
export type WorkerHybridDecryptResponse = WorkerSuccessResponse<'hybridDecrypt'> &
  KeyManagerHybridDecryptResult;
export type WorkerHybridEncryptResponse = WorkerSuccessResponse<'hybridEncrypt'> &
  KeyManagerHybridEncryptResult;
