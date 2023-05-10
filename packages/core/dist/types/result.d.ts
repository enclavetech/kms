import type { CryptOpPayloadData } from '../interfaces/payload-data/crypt-op';
import type { HybridEncryptResultPayloadData } from '../interfaces/payload-data/hybrid-encrypt-result';
import type { KmsAction } from './action';
import type { KmsPayload } from './payload';
/** Returned to the user when their promise resolves. */
export type KmsResult<A extends KmsAction, T = void> = KmsPayload<A, T> & {
    error?: string;
    ok: boolean;
};
export type KeyImportResult = KmsResult<'importKey', string>;
export type SessionDestroyResult = KmsResult<'destroySession'>;
export type SessionExportResult = KmsResult<'exportSession', string>;
export type SessionImportResult = KmsResult<'importSession', string[]>;
export type DecryptResult = KmsResult<'decrypt', string>;
export type EncryptResult = KmsResult<'encrypt', CryptOpPayloadData>;
export type HybridDecryptResult = KmsResult<'hybridDecrypt', string>;
export type HybridEncryptResult = KmsResult<'hybridEncrypt', HybridEncryptResultPayloadData>;
