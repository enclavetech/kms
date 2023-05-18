import type { IAdapter } from '@enclavetech/kms-core';
import { type PrivateKey, type PublicKey, type SessionKey } from 'openpgp';
export declare class Adapter implements IAdapter<PrivateKey, PublicKey, SessionKey> {
    decryptSessionKey(armoredMessage: string, decryptionKeys: PrivateKey): Promise<SessionKey>;
    decryptWithPrivateKey(armoredMessage: string, decryptionKeys: PrivateKey): Promise<string>;
    decryptWithSessionKey(armoredMessage: string, sessionKeys: SessionKey): Promise<string>;
    encryptSessionKey(sessionKey: SessionKey, encryptionKeys: PrivateKey): Promise<string>;
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
export default Adapter;
