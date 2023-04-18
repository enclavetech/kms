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
export type KeyManagerImportKeyRequest = KeyManagerRequest<'importKey'> & IDataMixin<PrivateKey> & IMaybeKeyIdMixin;
export type KeyManagerDecryptRequest = KeyManagerRequest<'decrypt'> & IDataMixin<string> & IKeyIdMixin;
export type KeyManagerEncryptRequest = KeyManagerRequest<'encrypt'> & IDataMixin<string> & IKeyIdMixin;
