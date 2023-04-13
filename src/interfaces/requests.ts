import type { KeyManagerAction, PrivateKey, PrivateKeyID } from '../types';

/**
 * Base interface for a KeyManager request.
 * These interfaces define the shape of the data
 * that users supply when interacting with this package.
 */
export interface KeyManagerRequest<A extends KeyManagerAction, Data> {
  action: A;
  data: Data;
  privateKeyID: PrivateKeyID;
}

export type KeyManagerDecryptRequest = KeyManagerRequest<'decrypt', string>;
export type KeyManagerEncryptRequest = KeyManagerRequest<'encrypt', string>;
export type KeyManagerPutRequest = KeyManagerRequest<'put', PrivateKey>;
