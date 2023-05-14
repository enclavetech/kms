import { type PrivateKey, type PublicKey, type SessionKey } from 'openpgp';
import type { ILibImpl } from '@enclavetech/kms-core';
export declare class PGPLibImpl implements ILibImpl<PrivateKey, PublicKey, SessionKey> {
    decryptSessionKey(armoredMessage: string, decryptionKeys: PrivateKey): Promise<SessionKey>;
    decryptWithPrivateKey(armoredMessage: string, decryptionKeys: PrivateKey): Promise<string>;
    decryptWithSessionKey(armoredMessage: string, sessionKeys: SessionKey): Promise<string>;
    encryptSessionKey(sessionKey: SessionKey, encryptionKeys: PrivateKey): Promise<string>;
    /** @deprecated */
    encryptWithPrivateKey(text: string, encryptionKeys: PrivateKey): Promise<string>;
    encryptWithPublicKey(text: string, encryptionKeys: PublicKey): Promise<string>;
    encryptWithSessionKey(text: string, sessionKey: SessionKey): Promise<string>;
    generatePrivateKey(): Promise<PrivateKey>;
    generateSessionKey(encryptionKeys: PublicKey): Promise<SessionKey>;
    parsePrivateKey(armoredKey: string): Promise<PrivateKey>;
    parsePublicKey(armoredKey: string): Promise<PublicKey>;
    stringifyPrivateKey(key: PrivateKey): string;
    stringifyPublicKey(key: PublicKey): string;
    symmetricDecrypt(armoredMessage: string, passwords: string): Promise<string>;
    symmetricEncrypt(text: string, passwords: string): Promise<string>;
}
