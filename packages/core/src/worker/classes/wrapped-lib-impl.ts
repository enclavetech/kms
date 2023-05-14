import type { ILibImpl } from '../interfaces/lib-impl';
import { AdapterError } from '../errors/adapter-error';

export class WrappedLibImpl<PrivateKeyType extends object, SessionKeyType extends object>
  implements ILibImpl<PrivateKeyType, SessionKeyType>
{
  constructor(private readonly libImpl: ILibImpl<PrivateKeyType, SessionKeyType>) {}

  /** Ensures a promise is always the return value and handles errors. */
  private async wrap<T>(fn: () => T, fnName: string): Promise<Awaited<T>> {
    try {
      return await fn();
    } catch (e) {
      throw new AdapterError(fnName);
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

  encryptSessionKey(sessionKey: SessionKeyType, privateKey: PrivateKeyType) {
    return this.wrap(() => this.libImpl.encryptSessionKey(sessionKey, privateKey), this.encryptSessionKey.name);
  }

  encryptWithPrivateKey(payload: string, key: PrivateKeyType) {
    return this.wrap(() => this.libImpl.encryptWithPrivateKey(payload, key), this.encryptWithPrivateKey.name);
  }

  encryptWithSessionKey(payload: string, key: SessionKeyType) {
    return this.wrap(() => this.libImpl.encryptWithSessionKey(payload, key), this.encryptWithSessionKey.name);
  }

  generatePrivateKey() {
    return this.wrap(() => this.libImpl.generatePrivateKey(), this.generatePrivateKey.name);
  }

  generateSessionKey(privateKey: PrivateKeyType) {
    return this.wrap(() => this.libImpl.generateSessionKey(privateKey), this.generateSessionKey.name);
  }

  parsePrivateKey(key: string) {
    return this.wrap(() => this.libImpl.parsePrivateKey(key), this.parsePrivateKey.name);
  }

  stringifyPrivateKey(key: PrivateKeyType) {
    return this.wrap(() => this.libImpl.stringifyPrivateKey(key), this.stringifyPrivateKey.name);
  }
}
