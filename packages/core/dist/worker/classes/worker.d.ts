import type { IAdapter } from '../interfaces';
export declare class Worker<PrivateKeyType, PublicKeyType, SessionKeyType> {
    private readonly adapter;
    private keyPairMap;
    constructor(adapter: IAdapter<PrivateKeyType, PublicKeyType, SessionKeyType>);
    /**
     * Ensures an error response message is sent on exception.
     * @param fn The function to wrap.
     * @param job The job being processed.
     * @returns The return from `fn`.
     */
    private wrapJob;
    private errorResponse;
    private asymmetricDecrypt;
    private asymmetricEncrypt;
    private destroySession;
    private encryptPrivateKey;
    private exportSession;
    private generateKeyPair;
    private hybridDecrypt;
    private hybridEncrypt;
    private importKeyPair;
    private importSession;
    private hybridShareKey;
    private symmetricDecrypt;
    private symmetricEncrypt;
}
