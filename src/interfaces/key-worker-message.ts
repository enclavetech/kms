export interface KeyWorkerMessage {
  /**
   * The command given to the key manager worker.
   */
  action: 'put' | 'encrypt' | 'decrypt';

  /**
   * The ID of the key.
   */
  id: string;

  /**
   * Either the payload to encrypt/decrypt,
   * or the decrypted private key to be stored.
   */
  payload: string;
}
