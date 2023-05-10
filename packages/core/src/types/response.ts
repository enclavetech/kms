import type { CryptOpPayloadData } from '../interfaces/payload-data/crypt-op';
import type { HybridEncryptResultPayloadData } from '../interfaces/payload-data/hybrid-encrypt-result';
import type { KmsAction } from './action';
import type { KmsJob } from './job';
import type { KmsResult } from './result';

/** Used internally for communication from workers. */
export type KmsResponse<A extends KmsAction, T = void> = KmsJob<A, T> & KmsResult<A, T>;

export type KeyImportResponse = KmsResponse<'importKey', string>;

export type SessionDestroyResponse = KmsResponse<'destroySession'>;
export type SessionExportResponse = KmsResponse<'exportSession', string>;
export type SessionImportResponse = KmsResponse<'importSession', string[]>;

export type DecryptResponse = KmsResponse<'decrypt', string>;
export type EncryptResponse = KmsResponse<'encrypt', CryptOpPayloadData>;

export type HybridDecryptResponse = KmsResponse<'hybridDecrypt', string>;
export type HybridEncryptResponse = KmsResponse<'hybridEncrypt', HybridEncryptResultPayloadData>;
