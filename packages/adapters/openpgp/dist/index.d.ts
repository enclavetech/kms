import type { IAdapter } from '@enclavetech/kms-core';
import { type PrivateKey, type PublicKey, type SessionKey } from 'openpgp';
export declare class Adapter implements IAdapter<PrivateKey, PublicKey, SessionKey> {
    decryptPrivateKey(armoredKey: string, passphrase: string): Promise<PrivateKey>;
    decryptSessionKey(armoredMessage: string, decryptionKeys: PrivateKey): Promise<SessionKey>;
    decryptWithPrivateKey(armoredMessage: string, decryptionKeys: PrivateKey): Promise<import("openpgp").MaybeStream<import("openpgp").Data> & string>;
    decryptWithSessionKey(armoredMessage: string, sessionKeys: SessionKey): Promise<import("openpgp").MaybeStream<import("openpgp").Data> & string>;
    derivePublicKey(privateKey: PrivateKey): PublicKey;
    encryptPrivateKey(privateKey: PrivateKey, passphrase: string): Promise<string>;
    encryptSessionKey(sessionKey: SessionKey, encryptionKeys: PrivateKey): Promise<string>;
    encryptWithPrivateKey(text: string, encryptionKeys: PrivateKey): Promise<string>;
    encryptWithPublicKey(text: string, encryptionKeys: PublicKey): Promise<string>;
    encryptWithSessionKey(text: string, sessionKey: SessionKey): Promise<string>;
    generateKeyPair(): Promise<import("openpgp").KeyPair & {
        revocationCertificate: string;
    }>;
    generatePrivateKey(): Promise<PrivateKey>;
    generateSessionKey(encryptionKeys: PublicKey): Promise<SessionKey>;
    parsePrivateKey(armoredKey: string): Promise<PrivateKey>;
    parsePublicKey(armoredKey: string): Promise<import("openpgp").Key>;
    stringifyPrivateKey(key: PrivateKey): string;
    stringifyPublicKey(key: PublicKey): string;
    symmetricDecrypt(armoredMessage: string, passwords: string): Promise<import("openpgp").MaybeStream<import("openpgp").Data> & string>;
    symmetricEncrypt(text: string, passwords: string): Promise<string>;
}
export default Adapter;
