import type { KeyManagerAction } from '../../types';
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

// Key I/O
export type KeyManagerImportKeyResult = KeyManagerSuccessResult<'importKey'> & IKeyIdMixin;

// Session I/O
export type KeyManagerExportSessionResult = KeyManagerSuccessResult<'exportSession'>;
export type KeyManagerImportSessionResult = KeyManagerSuccessResult<'importSession'>;

// Encrypt/decrypt
export type KeyManagerDecryptResult = KeyManagerSuccessResult<'decrypt'> & IDataMixin<string> & IKeyIdMixin;
export type KeyManagerEncryptResult = KeyManagerSuccessResult<'encrypt'> & IDataMixin<string> & IKeyIdMixin;
