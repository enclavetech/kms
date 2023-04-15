import type { KeyManagerRequest } from './request';

export type * from './request';
export type * from './import-key';

export type KeyManagerDecryptRequest = KeyManagerRequest<'decrypt', string>;
export type KeyManagerEncryptRequest = KeyManagerRequest<'encrypt', string>;
