import type { KeyManagerAction } from '../../types';
import type { KeyManagerDecryptResult, KeyManagerEncryptResult, KeyManagerImportKeyResult, KeyManagerResult } from '../results';
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
export type WorkerImportKeyResponse = WorkerSuccessResponse<'importKey'> & KeyManagerImportKeyResult;
export type WorkerDecryptResponse = WorkerSuccessResponse<'decrypt'> & KeyManagerDecryptResult;
export type WorkerEncryptResponse = WorkerSuccessResponse<'encrypt'> & KeyManagerEncryptResult;
