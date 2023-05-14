import type * as Payloads from '../../shared/interfaces/payloads';
import type { KmsConfig } from '../interfaces/configs/kms-config';
/** Abstract class that defines the Enclave KMS public API. */
export declare abstract class KMS {
    protected abstract readonly config: KmsConfig;
    /** Decrypt a payload with a private key. */
    abstract asymmetricDecrypt(request: Payloads.CryptPayload): Promise<Payloads.DecryptResult>;
    /** Encrypt a payload with a public key or key pair. */
    abstract asymmetricEncrypt(request: Payloads.CryptPayload): Promise<Payloads.CryptPayload>;
    /** Clear the KMS & destroy the active session. */
    abstract destroySession(): Promise<void>;
    /** Export an encrypted snapshot of the current KMS state. */
    abstract exportSession(): Promise<Payloads.ExportSessionResult>;
    /** Decrypt a payload with an asymetrically encrypted session key. */
    abstract hybridDecrypt(request: Payloads.HybridDecryptRequest): Promise<Payloads.DecryptResult>;
    /** Encrypt a payload with an asymmetrically encrypted session key. */
    abstract hybridEncrypt(request: Payloads.CryptPayload): Promise<Payloads.HybridEncryptResult>;
    /**
     * Import private keys into the KMS.
     * @param requests One or more import private key requests.
     */
    abstract importPrivateKeys(...requests: Payloads.ImportPrivateKeyRequest[]): Promise<Payloads.ImportPrivateKeyResult[]>;
    /** Import a previously exported KMS session. */
    abstract importSession<T extends boolean>(request: Payloads.ImportSessionRequest<T>): Promise<Payloads.ImportSessionResult<T>>;
    /** Re-encrypt an encrypted session key with another key pair. */
    abstract reencryptSessionKey(request: Payloads.ReencryptSessionKeyRequest): Promise<Payloads.CryptPayload>;
}
