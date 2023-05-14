import type { ILibImpl } from '../interfaces';
export declare class Worker<PrivateKeyType extends object, SessionKeyType extends object> {
    private readonly libImpl;
    private keyMap;
    constructor(libImpl: ILibImpl<PrivateKeyType, SessionKeyType>);
    /**
     * Ensures an error response message is sent on exception.
     * @param fn The function to wrap.
     * @param job The job being processed.
     * @returns The return from `fn`.
     */
    private wrap;
    private errorResponse;
    private getPrivateKey;
    private asymmetricDecrypt;
    private asymmetricEncrypt;
    private destroySession;
    private exportSession;
    private hybridDecrypt;
    private hybridEncrypt;
    private importPrivateKey;
    private importSession;
    private reencryptSessionKey;
}
