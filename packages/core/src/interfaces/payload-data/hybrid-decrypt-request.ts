import type { CryptOpPayloadData } from './crypt-op';

export interface HybridDecryptRequestPayloadData extends CryptOpPayloadData {
  payloadKey: string;
}
