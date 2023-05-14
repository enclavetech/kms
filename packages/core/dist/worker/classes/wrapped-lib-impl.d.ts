import type { ILibImpl } from '../interfaces/lib-impl';
export declare class WrappedLibImpl<PrivateKeyType extends object, SessionKeyType extends object> implements ILibImpl<PrivateKeyType, SessionKeyType> {
    private readonly libImpl;
    constructor(libImpl: ILibImpl<PrivateKeyType, SessionKeyType>);
    /** Ensures a promise is always the return value and handles errors. */
    private wrap;
    decryptSessionKey(sessionKey: string, privateKey: PrivateKeyType): Promise<Awaited<SessionKeyType> | Awaited<SessionKeyType>>;
    decryptWithPrivateKey(payload: string, key: PrivateKeyType): Promise<string>;
    decryptWithSessionKey(payload: string, key: SessionKeyType): Promise<string>;
    encryptSessionKey(sessionKey: SessionKeyType, privateKey: PrivateKeyType): Promise<string>;
    encryptWithPrivateKey(payload: string, key: PrivateKeyType): Promise<string>;
    encryptWithSessionKey(payload: string, key: SessionKeyType): Promise<string>;
    generatePrivateKey(): Promise<Awaited<PrivateKeyType> | Awaited<PrivateKeyType>>;
    generateSessionKey(privateKey: PrivateKeyType): Promise<Awaited<SessionKeyType> | Awaited<SessionKeyType>>;
    parsePrivateKey(key: string): Promise<Awaited<PrivateKeyType> | Awaited<PrivateKeyType>>;
    stringifyPrivateKey(key: PrivateKeyType): Promise<string>;
}
