import type { IAdapter } from '@enclavetech/kms-core';
import {
  type KeyLike,
  compactDecrypt,
  CompactEncrypt,
  exportJWK,
  generateKeyPair,
  importJWK,
  type CompactJWEHeaderParameters,
} from 'jose';

// TODO: review algorithms
// eventually they'll be configurable, but we'll have sensible defaults
// may need extra logic to determine alg of imported keys, etc.

const KEY_ALG = 'ES512';

export class Adapter implements IAdapter<KeyLike, KeyLike, KeyLike> {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  async asymmetricEncrypt(payload: string, key: KeyLike | Uint8Array) {
    return this.encrypt(payload, key, {
      alg: 'ECDH-ES+A256KW',
      enc: 'A256CBC-HS512',
    });
  }

  async decrypt(payload: string, key: KeyLike | Uint8Array) {
    return this.decoder.decode((await compactDecrypt(payload, key)).plaintext);
  }

  async decryptPrivateKey(privateKey: string, secret: string) {
    return await this.parsePrivateKey(await this.symmetricDecrypt(privateKey, secret));
  }

  async decryptSessionKey(sessionKey: string, privateKey: KeyLike) {
    return this.parseKey(await this.decrypt(sessionKey, privateKey));
  }

  readonly decryptWithPrivateKey = this.decrypt;
  readonly decryptWithSessionKey = this.decrypt;

  async encrypt(payload: string, key: KeyLike | Uint8Array, protectedHeader: CompactJWEHeaderParameters) {
    return new CompactEncrypt(this.encoder.encode(payload)).setProtectedHeader(protectedHeader).encrypt(key);
  }

  async encryptPrivateKey(privateKey: KeyLike, secret: string) {
    return await this.symmetricEncrypt(await this.stringifyPrivateKey(privateKey), secret);
  }

  async encryptSessionKey(sessionKey: KeyLike, publicKey: KeyLike) {
    return this.asymmetricEncrypt(await this.stringifyKey(sessionKey), publicKey);
  }

  readonly encryptWithPrivateKey = this.asymmetricEncrypt;
  readonly encryptWithPublicKey = this.asymmetricEncrypt;

  encryptWithSessionKey(payload: string, key: KeyLike) {
    return this.encrypt(payload, key, {
      alg: 'PBES2-HS512+A256KW',
      enc: 'A256CBC-HS512',
    });
  }

  generateKeyPair() {
    return generateKeyPair(KEY_ALG, { extractable: true });
  }

  async generatePrivateKey() {
    return (await this.generateKeyPair()).privateKey;
  }

  generateSessionKey(publicKey: KeyLike): KeyLike {
    throw 'Method not implemented'; // TODO
  }

  async parseKey(key: string) {
    const parsed = await importJWK({ ...JSON.parse(key), ext: true }, KEY_ALG);
    if (parsed instanceof Uint8Array) throw 'Unexpected key format';
    return parsed;
  }

  readonly parsePrivateKey = this.parseKey;
  readonly parsePublicKey = this.parseKey;

  async stringifyKey(key: KeyLike) {
    return JSON.stringify(await exportJWK(key));
  }

  readonly stringifyPrivateKey = this.stringifyKey;
  readonly stringifyPublicKey = this.stringifyKey;

  symmetricDecrypt(payload: string, passphrase: string) {
    return this.decrypt(payload, this.encoder.encode(passphrase));
  }

  symmetricEncrypt(payload: string, password: string) {
    return this.encrypt(payload, this.encoder.encode(password), {
      alg: 'PBES2-HS512+A256KW',
      enc: 'A256CBC-HS512',
    });
  }
}

export default Adapter;
