import type { MaybePromise } from '../../shared/types/maybe';

export interface ILibImpl<PrivateKeyType extends object, SessionKeyType extends object> {
  generatePrivateKey(): MaybePromise<PrivateKeyType>;
  generateSessionKey(privateKey: PrivateKeyType): MaybePromise<SessionKeyType>;

  parsePrivateKey(key: string): MaybePromise<PrivateKeyType>;
  stringifyPrivateKey(key: PrivateKeyType): MaybePromise<string>;

  decryptSessionKey(sessionKey: string, privateKey: PrivateKeyType): MaybePromise<SessionKeyType>;
  encryptSessionKey(sessionKey: SessionKeyType, privateKey: PrivateKeyType): MaybePromise<string>;

  decryptWithPrivateKey(payload: string, key: PrivateKeyType): MaybePromise<string>;
  decryptWithSessionKey(payload: string, key: SessionKeyType): MaybePromise<string>;

  encryptWithPrivateKey(payload: string, key: PrivateKeyType): MaybePromise<string>;
  encryptWithSessionKey(payload: string, key: SessionKeyType): MaybePromise<string>;
}
