import type { CryptPayload } from './crypt-op';
export interface HybridDecryptRequest extends CryptPayload {
    /** The encrypted session key originally used to encrypt the payload. */
    payloadKey: string;
}
