import type { ILibImpl } from '../interfaces/lib-impl';
import type { Action, Job } from '../types';
export declare class Worker<PrivateKeyType extends object, SessionKeyType extends object> {
    private readonly libImpl;
    private keyMap;
    constructor(libImpl: ILibImpl<PrivateKeyType, SessionKeyType>);
    protected errorResponse<A extends Action>(error: string, job: Job<A>): void;
    protected getPrivateKey(keyID: string, job: Job<Action>): PrivateKeyType;
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
