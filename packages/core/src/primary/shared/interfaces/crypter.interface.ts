/** I can encrypt and decrypt things. */
export interface ICrypter {
  decrypt(request: unknown): Promise<unknown>;
  encrypt(request: unknown): Promise<unknown>;
}
