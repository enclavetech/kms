import type { IAdapter } from '../interfaces';
export declare class Worker<PrivateKeyType, PublicKeyType, SessionKeyType> {
    private readonly adapter;
    private keyPairMap;
    constructor(libImpl: IAdapter<PrivateKeyType, PublicKeyType, SessionKeyType>);
    /**
     * Ensures an error response message is sent on exception.
     * @param fn The function to wrap.
     * @param job The job being processed.
     * @returns The return from `fn`.
     */
    private wrap;
    private errorResponse;
    private asymmetricDecrypt;
    private asymmetricEncrypt;
    private destroySession;
    private exportSession;
    private hybridDecrypt;
    private hybridEncrypt;
    private importKeyPair;
    private importSession;
    private reencryptSessionKey;
    private symmetricDecrypt;
    private symmetricEncrypt;
}
