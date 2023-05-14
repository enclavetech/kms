import type * as Payloads from '../../shared/interfaces/payloads';
/** Defines the Enclave KMS public API. */
export interface KMS {
    /** Decrypt a payload with a private key. */
    asymmetricDecrypt(request: Payloads.AsymmetricCryptPayload): Promise<Payloads.CryptResult>;
    /** Encrypt a payload with a public key or key pair. */
    asymmetricEncrypt(request: Payloads.AsymmetricCryptPayload): Promise<Payloads.AsymmetricCryptPayload>;
    /** Clear the KMS & destroy the active session. */
    destroySession(): Promise<void>;
    /** Export an encrypted snapshot of the current KMS state. */
    exportSession(): Promise<Payloads.ExportSessionResult>;
    /** Decrypt a payload with an asymetrically encrypted session key. */
    hybridDecrypt(request: Payloads.HybridDecryptRequest): Promise<Payloads.CryptResult>;
    /** Encrypt a payload with an asymmetrically encrypted session key. */
    hybridEncrypt(request: Payloads.AsymmetricCryptPayload): Promise<Payloads.HybridEncryptResult>;
    /**
     * Import keys into the KMS.
     * @param requests One or more keys to import.
     */
    importKeys(...requests: Payloads.ImportKeyRequest[]): Promise<Payloads.ImportKeysResult[]>;
    /** Import a previously exported KMS session. */
    importSession<T extends boolean>(request: Payloads.ImportSessionRequest<T>): Promise<Payloads.ImportSessionResult<T>>;
    /** Re-encrypt an encrypted session key with another key pair. */
    reencryptSessionKey(request: Payloads.ReencryptSessionKeyRequest): Promise<Payloads.AsymmetricCryptPayload>;
    /** Decrypt a payload with a passphrase. */
    symmetricDecrypt(request: Payloads.SymmetricCryptPayload): Promise<Payloads.CryptResult>;
    /** Encrypt a payload with a passphrase. */
    symmetricEncrypt(request: Payloads.SymmetricCryptPayload): Promise<Payloads.CryptResult>;
}
