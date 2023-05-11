import type { CryptOpPayloadData } from '../interfaces/payload-data/crypt-op';
import type { HybridDecryptRequestPayloadData } from '../interfaces/payload-data/hybrid-decrypt-request';
import type { KeyImportRequestPayloadData } from '../interfaces/payload-data/key-import-request';
import type { HybridEncryptResultPayloadData } from '../interfaces/payload-data/hybrid-encrypt-result';
import type { SessionImportExportResultPayloadData } from '../interfaces/payload-data/session-import-export-result';
import type { KmsAction } from './action';

export interface KmsPayload<A extends KmsAction, T = void> {
  action: A;
  payload: T;
}

export type KeyImportRequestPayload = KmsPayload<'importKey', KeyImportRequestPayloadData>;
export type KeyImportResultPayload = KmsPayload<'importKey', string>;

export type SessionDestroyPayload = KmsPayload<'destroySession'>;
export type SessionExportRequestPayload = KmsPayload<'exportSession'>;
export type SessionExportResultPayload = KmsPayload<'exportSession', string>;
export type SessionImportRequestPayload = KmsPayload<'importSession', string>;
export type SessionImportResultPayload = KmsPayload<'importSession', string[]>;
export type SessionImportExportRequestPayload = KmsPayload<'importExportSession', string>;
export type SessionImportExportResultPayload = KmsPayload<
  'importExportSession',
  SessionImportExportResultPayloadData
>;

export type DecryptRequestPayload = KmsPayload<'decrypt', CryptOpPayloadData>;
export type DecryptResultPayload = KmsPayload<'decrypt', string>;
export type EncryptPayload = KmsPayload<'encrypt', CryptOpPayloadData>;

export type HybridDecryptRequestPayload = KmsPayload<
  'hybridDecrypt',
  HybridDecryptRequestPayloadData
>;
export type HybridDecryptResultPayload = KmsPayload<'hybridDecrypt', string>;
export type HybridEncryptRequestPayload = KmsPayload<'hybridEncrypt', CryptOpPayloadData>;
export type HybridEncryptResultPayload = KmsPayload<
  'hybridEncrypt',
  HybridEncryptResultPayloadData
>;
