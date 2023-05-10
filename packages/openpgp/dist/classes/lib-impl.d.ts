import { type PrivateKey, type SessionKey } from 'openpgp';
import type { ILibImpl } from '@enclavetech/kms-core';
export declare class PGPLibImpl implements ILibImpl<PrivateKey, SessionKey> {
    stringifyPrivateKey(key: PrivateKey): string;
    parsePrivateKey(armoredKey: string): Promise<PrivateKey>;
    decryptSessionKey(armoredMessage: string, decryptionKeys: PrivateKey): Promise<SessionKey>;
    encryptSessionKey(sessionKey: SessionKey, encryptionKeys: PrivateKey): Promise<string>;
    generatePrivateKey(): Promise<PrivateKey>;
    generateSessionKey(encryptionKeys: PrivateKey): Promise<SessionKey>;
    decryptWithPrivateKey(armoredMessage: string, decryptionKeys: PrivateKey): Promise<string>;
    decryptWithSessionKey(armoredMessage: string, sessionKeys: SessionKey): Promise<string>;
    encryptWithPrivateKey(text: string, encryptionKeys: PrivateKey): Promise<string>;
    encryptWithSessionKey(text: string, sessionKey: SessionKey): Promise<string>;
}
