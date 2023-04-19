import type { PrivateKey } from 'openpgp';
import type { KeyManagerAction } from '../../types';
import type { IDataMixin, IKeyIdMixin, IMaybeKeyIdMixin } from '../mixins';

/**
 * Base interface for a KeyManager request.
 * These interfaces define the shape of the data
 * that users supply when interacting with this package.
 */
export interface KeyManagerRequest<Action extends KeyManagerAction> {
  action: Action;
}

// Key I/O
export type KeyManagerImportKeyRequest = KeyManagerRequest<'importKey'> &
  IDataMixin<PrivateKey> &
  IMaybeKeyIdMixin;

// Session I/O
export type KeyManagerDestroySessionRequest = KeyManagerRequest<'destroySession'>;
export type KeyManagerExportSessionRequest = KeyManagerRequest<'exportSession'>;
export type KeyManagerImportSessionRequest = KeyManagerRequest<'importSession'> & IDataMixin<string>;

// Encrypt/decrypt
export type KeyManagerDecryptRequest = KeyManagerRequest<'decrypt'> & IDataMixin<string> & IKeyIdMixin;
export type KeyManagerEncryptRequest = KeyManagerRequest<'encrypt'> & IDataMixin<string> & IKeyIdMixin;
