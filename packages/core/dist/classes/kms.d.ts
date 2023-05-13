import type { KmsConfig } from '../interfaces/configs/kms-config';
import type * as Payload from '../interfaces/payloads';
/** Abstract class that defines the Enclave KMS public API. */
export declare abstract class KMS {
    protected abstract readonly config: KmsConfig;
    /** Decrypt a payload with a private key. */
    abstract asymmetricDecrypt(request: Payload.CryptPayload): Promise<Payload.DecryptResult>;
    /** Encrypt a payload with a public key or key pair. */
    abstract asymmetricEncrypt(request: Payload.CryptPayload): Promise<Payload.CryptPayload>;
    /** Clear the KMS & destroy the active session. */
    abstract destroySession(): Promise<void>;
    /** Export an encrypted snapshot of the current KMS state. */
    abstract exportSession(): Promise<Payload.ExportSessionResult>;
    /** Decrypt a payload with an asymetrically encrypted session key. */
    abstract hybridDecrypt(request: Payload.HybridDecryptRequest): Promise<Payload.DecryptResult>;
    /** Encrypt a payload with an asymmetrically encrypted session key. */
    abstract hybridEncrypt(request: Payload.CryptPayload): Promise<Payload.HybridEncryptResult>;
    /** Import a private key into the KMS. */
    abstract importPrivateKey(request: Payload.ImportPrivateKeyRequest): Promise<Payload.ImportPrivateKeyResult>;
    /** Import a previously exported KMS session. */
    abstract importSession<T extends boolean>(request: Payload.ImportSessionRequest<T>): Promise<Payload.ImportSessionResult<T>>;
    /** Re-encrypt an encrypted session key with another key pair. */
    abstract reencryptSessionKey(request: Payload.ReencryptSessionKeyRequest): Promise<Payload.CryptPayload>;
}
