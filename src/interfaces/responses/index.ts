import type { KeyManagerAction } from '../../types';
import type {
  KeyManagerDecryptResult,
  KeyManagerEncryptResult,
  KeyManagerExportSessionResult,
  KeyManagerImportKeyResult,
  KeyManagerImportSessionResult,
  KeyManagerResult,
} from '../results';

export interface WorkerResponse<Action extends KeyManagerAction> extends KeyManagerResult<Action> {
  jobID: number;
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
export type WorkerExportSessionResponse = WorkerSuccessResponse<'exportSession'> &
  KeyManagerExportSessionResult;
export type WorkerImportSessionResponse = WorkerSuccessResponse<'importSession'> &
  KeyManagerImportSessionResult;

// Encrypt/decrypt
export type WorkerDecryptResponse = WorkerSuccessResponse<'decrypt'> & KeyManagerDecryptResult;
export type WorkerEncryptResponse = WorkerSuccessResponse<'encrypt'> & KeyManagerEncryptResult;
