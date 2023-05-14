import type * as Payloads from '../../shared/interfaces/payloads';
import type { KmsConfig } from '../interfaces/kms-config';

// TODO: group methods into namespaces

/** Abstract class that defines the Enclave KMS public API. */
export abstract class KMS {
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
   * Import keys into the KMS.
   * @param requests One or more keys to import.
   */
  abstract importKeys(...requests: Payloads.ImportKeyRequest[]): Promise<Payloads.ImportKeysResult[]>;

  /** Import a previously exported KMS session. */
  abstract importSession<T extends boolean>(
    request: Payloads.ImportSessionRequest<T>,
  ): Promise<Payloads.ImportSessionResult<T>>;

  /** Re-encrypt an encrypted session key with another key pair. */
  abstract reencryptSessionKey(request: Payloads.ReencryptSessionKeyRequest): Promise<Payloads.CryptPayload>;
}
