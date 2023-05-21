import type { IAdapter } from '../interfaces/adapter';
export declare class WrappedAdapter<PrivateKeyType, PublicKeyType, SessionKeyType> implements IAdapter<PrivateKeyType, PublicKeyType, SessionKeyType> {
    private readonly adapter;
    constructor(adapter: IAdapter<PrivateKeyType, PublicKeyType, SessionKeyType>);
    /** Ensures a promise is always the return value and handles errors. */
    private wrap;
    decryptPrivateKey(privateKey: string, secret: string): Promise<Awaited<PrivateKeyType> | Awaited<PrivateKeyType>>;
    decryptSessionKey(sessionKey: string, privateKey: PrivateKeyType): Promise<Awaited<SessionKeyType> | Awaited<SessionKeyType>>;
    decryptWithPrivateKey(payload: string, key: PrivateKeyType): Promise<string>;
    decryptWithSessionKey(payload: string, key: SessionKeyType): Promise<string>;
    encryptPrivateKey(privateKey: PrivateKeyType, secret: string): Promise<string>;
    encryptSessionKey(sessionKey: SessionKeyType, publicKey: PublicKeyType): Promise<string>;
    /** @deprecated */
    encryptWithPrivateKey(payload: string, key: PrivateKeyType): Promise<string>;
    encryptWithPublicKey(payload: string, key: PublicKeyType): Promise<string>;
    encryptWithSessionKey(payload: string, key: SessionKeyType): Promise<string>;
    generateKeyPair(): Promise<{
        privateKey: PrivateKeyType;
        publicKey: PublicKeyType;
    }>;
    generatePrivateKey(): Promise<Awaited<PrivateKeyType> | Awaited<PrivateKeyType>>;
    generateSessionKey(publicKey: PublicKeyType): Promise<Awaited<SessionKeyType> | Awaited<SessionKeyType>>;
    parsePrivateKey(key: string): Promise<Awaited<PrivateKeyType> | Awaited<PrivateKeyType>>;
    parsePublicKey(key: string): Promise<Awaited<PublicKeyType> | Awaited<PublicKeyType>>;
    stringifyPrivateKey(key: PrivateKeyType): Promise<string>;
    stringifyPublicKey(key: PublicKeyType): Promise<string>;
    symmetricDecrypt(payload: string, passphrase: string): Promise<string>;
    symmetricEncrypt(payload: string, passphrase: string): Promise<string>;
}
