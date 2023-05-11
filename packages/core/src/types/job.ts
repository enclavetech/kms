import type { CryptOpPayloadData } from '../interfaces/payload-data/crypt-op';
import type { HybridDecryptRequestPayloadData } from '../interfaces/payload-data/hybrid-decrypt-request';
import type { KeyImportRequestPayloadData } from '../interfaces/payload-data/key-import-request';
import type { KmsAction } from './action';
import type { KmsPayload } from './payload';

/** Used internally for communication to workers. */
export type KmsJob<A extends KmsAction, T = void> = KmsPayload<A, T> & {
  jobID: number;
};

export type KeyImportJob = KmsJob<'importKey', KeyImportRequestPayloadData>;

export type SessionDestroyJob = KmsJob<'destroySession'>;
export type SessionExportJob = KmsJob<'exportSession'>;
export type SessionImportJob = KmsJob<'importSession', string>;
export type SessionImportExportJob = KmsJob<'importExportSession', string>;

export type DecryptJob = KmsJob<'decrypt', CryptOpPayloadData>;
export type EncryptJob = KmsJob<'encrypt', CryptOpPayloadData>;

export type HybridDecryptJob = KmsJob<'hybridDecrypt', HybridDecryptRequestPayloadData>;
export type HybridEncryptJob = KmsJob<'hybridEncrypt', CryptOpPayloadData>;
