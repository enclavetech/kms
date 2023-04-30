import type { KeyManagerAction } from '../../types';
import type { IHybridJobData } from '../hybrid-job-data.interface';
import type { IDataMixin, IKeyIdMixin } from '../mixins';
export interface KeyManagerResult<Action extends KeyManagerAction> {
    action: Action;
    ok: boolean;
}
export interface KeyManagerFailResult<Action extends KeyManagerAction> extends KeyManagerResult<Action> {
    error: string;
    ok: false;
}
export interface KeyManagerSuccessResult<Action extends KeyManagerAction> extends KeyManagerResult<Action> {
    ok: true;
}
export type KeyManagerImportKeyResult = KeyManagerSuccessResult<'importKey'> & IKeyIdMixin;
export type KeyManagerDestroySessionResult = KeyManagerSuccessResult<'destroySession'>;
export type KeyManagerExportSessionResult = KeyManagerSuccessResult<'exportSession'> & IDataMixin<string>;
export type KeyManagerImportSessionResult = KeyManagerSuccessResult<'importSession'> & IDataMixin<string[]>;
export type KeyManagerDecryptResult = KeyManagerSuccessResult<'decrypt'> & IDataMixin<string> & IKeyIdMixin;
export type KeyManagerEncryptResult = KeyManagerSuccessResult<'encrypt'> & IDataMixin<string> & IKeyIdMixin;
export type KeyManagerHybridDecryptResult = KeyManagerSuccessResult<'hybridDecrypt'> & IDataMixin<string> & IKeyIdMixin;
export type KeyManagerHybridEncryptResult = KeyManagerSuccessResult<'hybridEncrypt'> & IDataMixin<IHybridJobData> & IKeyIdMixin;
