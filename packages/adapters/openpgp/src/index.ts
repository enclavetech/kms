import type { IAdapter } from '@enclavetech/kms-core';
import {
  type PrivateKey,
  type PublicKey,
  type SessionKey,
  createMessage,
  decrypt,
  decryptSessionKeys,
  encrypt,
  generateKey,
  generateSessionKey,
  readMessage,
  readPrivateKey,
  encryptSessionKey,
  readKey,
} from 'openpgp';

export class Adapter implements IAdapter<PrivateKey, PublicKey, SessionKey> {
  async decryptSessionKey(armoredMessage: string, decryptionKeys: PrivateKey): Promise<SessionKey> {
    const message = await readMessage({ armoredMessage });
    return (await decryptSessionKeys({ message, decryptionKeys }))[0];
  }

  async decryptWithPrivateKey(armoredMessage: string, decryptionKeys: PrivateKey): Promise<string> {
    const message = await readMessage({ armoredMessage });
    return (await decrypt({ message, decryptionKeys })).data;
  }

  async decryptWithSessionKey(armoredMessage: string, sessionKeys: SessionKey): Promise<string> {
    const message = await readMessage({ armoredMessage });
    return (await decrypt({ message, sessionKeys })).data;
  }

  encryptSessionKey(sessionKey: SessionKey, encryptionKeys: PrivateKey): Promise<string> {
    return encryptSessionKey({ format: 'armored', encryptionKeys, ...sessionKey });
  }

  async encryptWithPrivateKey(text: string, encryptionKeys: PrivateKey): Promise<string> {
    const message = await createMessage({ text });
    return await encrypt({ message, encryptionKeys });
  }

  async encryptWithPublicKey(text: string, encryptionKeys: PublicKey): Promise<string> {
    const message = await createMessage({ text });
    return await encrypt({ message, encryptionKeys });
  }

  async encryptWithSessionKey(text: string, sessionKey: SessionKey): Promise<string> {
    const message = await createMessage({ text });
    return await encrypt({ message, sessionKey });
  }

  async generatePrivateKey(): Promise<PrivateKey> {
    return (await generateKey({ format: 'object', userIDs: {} })).privateKey;
  }

  generateSessionKey(encryptionKeys: PublicKey): Promise<SessionKey> {
    return generateSessionKey({ encryptionKeys });
  }

  parsePrivateKey(armoredKey: string): Promise<PrivateKey> {
    return readPrivateKey({ armoredKey });
  }

  parsePublicKey(armoredKey: string): Promise<PublicKey> {
    return readKey({ armoredKey });
  }

  stringifyPrivateKey(key: PrivateKey): string {
    return key.armor();
  }

  stringifyPublicKey(key: PublicKey): string {
    return key.armor();
  }

  async symmetricDecrypt(armoredMessage: string, passwords: string): Promise<string> {
    const message = await readMessage({ armoredMessage });
    return (await decrypt({ message, passwords })).data;
  }

  async symmetricEncrypt(text: string, passwords: string): Promise<string> {
    const message = await createMessage({ text });
    return await encrypt({ message, passwords });
  }
}

export default Adapter;
