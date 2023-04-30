import type { KeyManagerAction } from '../../types';
import type { IHybridJobData } from '../hybrid-job-data.interface';
import type { IDataMixin, IKeyIdMixin, IMaybeKeyIdMixin } from '../mixins';
/**
 * Base interface for a KeyManager request.
 * These interfaces define the shape of the data
 * that users supply when interacting with this package.
 */
export interface KeyManagerRequest<Action extends KeyManagerAction> {
    action: Action;
}
export type KeyManagerImportKeyRequest = KeyManagerRequest<'importKey'> & IDataMixin<string> & IMaybeKeyIdMixin;
export type KeyManagerDestroySessionRequest = KeyManagerRequest<'destroySession'>;
export type KeyManagerExportSessionRequest = KeyManagerRequest<'exportSession'>;
export type KeyManagerImportSessionRequest = KeyManagerRequest<'importSession'> & IDataMixin<string>;
export type KeyManagerDecryptRequest = KeyManagerRequest<'decrypt'> & IDataMixin<string> & IKeyIdMixin;
export type KeyManagerEncryptRequest = KeyManagerRequest<'encrypt'> & IDataMixin<string> & IKeyIdMixin;
export type KeyManagerHybridDecryptRequest = KeyManagerRequest<'hybridDecrypt'> & IDataMixin<IHybridJobData> & IKeyIdMixin;
export type KeyManagerHybridEncryptRequest = KeyManagerRequest<'hybridEncrypt'> & IDataMixin<string> & IKeyIdMixin;
