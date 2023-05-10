import {
  type PrivateKey,
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
} from 'openpgp';

import type { ILibImpl } from '@enclavetech/kms-core';

export class PGPLibImpl implements ILibImpl<PrivateKey, SessionKey> {
  stringifyPrivateKey(key: PrivateKey): string {
    return key.armor();
  }

  async parsePrivateKey(armoredKey: string): Promise<PrivateKey> {
    return await readPrivateKey({ armoredKey });
  }

  async decryptSessionKey(armoredMessage: string, decryptionKeys: PrivateKey): Promise<SessionKey> {
    const message = await readMessage({ armoredMessage });
    return (await decryptSessionKeys({ message, decryptionKeys }))[0];
  }

  async encryptSessionKey(sessionKey: SessionKey, encryptionKeys: PrivateKey): Promise<string> {
    return await encryptSessionKey({ format: 'armored', encryptionKeys, ...sessionKey });
  }

  async generatePrivateKey(): Promise<PrivateKey> {
    return (await generateKey({ format: 'object', userIDs: {} })).privateKey;
  }

  async generateSessionKey(encryptionKeys: PrivateKey): Promise<SessionKey> {
    return await generateSessionKey({ encryptionKeys });
  }

  async decryptWithPrivateKey(armoredMessage: string, decryptionKeys: PrivateKey): Promise<string> {
    const message = await readMessage({ armoredMessage });
    return (await decrypt({ message, decryptionKeys })).data;
  }

  async decryptWithSessionKey(armoredMessage: string, sessionKeys: SessionKey): Promise<string> {
    const message = await readMessage({ armoredMessage });
    return (await decrypt({ message, sessionKeys })).data;
  }

  async encryptWithPrivateKey(text: string, encryptionKeys: PrivateKey): Promise<string> {
    const message = await createMessage({ text });
    return await encrypt({ message, encryptionKeys });
  }

  async encryptWithSessionKey(text: string, sessionKey: SessionKey): Promise<string> {
    const message = await createMessage({ text });
    return await encrypt({ message, sessionKey });
  }
}
