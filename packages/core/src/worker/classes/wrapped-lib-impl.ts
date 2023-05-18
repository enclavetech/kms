import type { ILibImpl } from '../interfaces/lib-impl';
import { AdapterError } from '../errors/adapter-error';

export class WrappedLibImpl<PrivateKeyType, PublicKeyType, SessionKeyType>
  implements ILibImpl<PrivateKeyType, PublicKeyType, SessionKeyType>
{
  constructor(private readonly libImpl: ILibImpl<PrivateKeyType, PublicKeyType, SessionKeyType>) {}

  /** Ensures a promise is always the return value and handles errors. */
  private async wrap<T>(fn: () => T, fnName: string): Promise<Awaited<T>> {
    try {
      return await fn();
    } catch (e) {
      throw new AdapterError(this.libImpl.constructor.name, fnName);
    }
  }

  decryptSessionKey(sessionKey: string, privateKey: PrivateKeyType) {
    return this.wrap(() => this.libImpl.decryptSessionKey(sessionKey, privateKey), this.decryptSessionKey.name);
  }

  decryptWithPrivateKey(payload: string, key: PrivateKeyType) {
    return this.wrap(() => this.libImpl.decryptWithPrivateKey(payload, key), this.decryptWithPrivateKey.name);
  }

  decryptWithSessionKey(payload: string, key: SessionKeyType) {
    return this.wrap(() => this.libImpl.decryptWithSessionKey(payload, key), this.decryptWithSessionKey.name);
  }

  encryptSessionKey(sessionKey: SessionKeyType, publicKey: PublicKeyType) {
    return this.wrap(() => this.libImpl.encryptSessionKey(sessionKey, publicKey), this.encryptSessionKey.name);
  }

  /** @deprecated */
  encryptWithPrivateKey(payload: string, key: PrivateKeyType) {
    return this.wrap(() => this.libImpl.encryptWithPrivateKey(payload, key), this.encryptWithPrivateKey.name);
  }

  encryptWithPublicKey(payload: string, key: PublicKeyType) {
    return this.wrap(() => this.libImpl.encryptWithPublicKey(payload, key), this.encryptWithPublicKey.name);
  }

  encryptWithSessionKey(payload: string, key: SessionKeyType) {
    return this.wrap(() => this.libImpl.encryptWithSessionKey(payload, key), this.encryptWithSessionKey.name);
  }

  generatePrivateKey() {
    return this.wrap(() => this.libImpl.generatePrivateKey(), this.generatePrivateKey.name);
  }

  generateSessionKey(publicKey: PublicKeyType) {
    return this.wrap(() => this.libImpl.generateSessionKey(publicKey), this.generateSessionKey.name);
  }

  parsePrivateKey(key: string) {
    return this.wrap(() => this.libImpl.parsePrivateKey(key), this.parsePrivateKey.name);
  }

  parsePublicKey(key: string) {
    return this.wrap(() => this.libImpl.parsePublicKey(key), this.parsePublicKey.name);
  }

  stringifyPrivateKey(key: PrivateKeyType) {
    return this.wrap(() => this.libImpl.stringifyPrivateKey(key), this.stringifyPrivateKey.name);
  }

  stringifyPublicKey(key: PublicKeyType) {
    return this.wrap(() => this.libImpl.stringifyPublicKey(key), this.stringifyPublicKey.name);
  }

  symmetricDecrypt(payload: string, passphrase: string) {
    return this.wrap(() => this.libImpl.symmetricDecrypt(payload, passphrase), this.symmetricDecrypt.name);
  }

  symmetricEncrypt(payload: string, passphrase: string) {
    return this.wrap(() => this.libImpl.symmetricEncrypt(payload, passphrase), this.symmetricEncrypt.name);
  }
}
