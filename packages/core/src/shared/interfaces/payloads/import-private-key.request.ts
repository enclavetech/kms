export interface ImportPrivateKeyRequest {
  /**
   * A private key string to import.
   *
   * @todo Make it a `MaybeArray<string>`.
   */
  privateKey: string;

  /**
   * The ID of the key.
   *
   * @todo Make it optional.
   */
  keyID: string;
}
