import type { ILibImpl } from '../interfaces/lib-impl';
import type { KmsAction } from '../types/action';
import type { KmsJob } from '../types/job';
export declare class Worker<PrivateKeyType extends object, SessionKeyType extends object> {
    private readonly libImpl;
    private keyMap;
    constructor(libImpl: ILibImpl<PrivateKeyType, SessionKeyType>);
    protected errorResponse<A extends KmsAction, T>(error: string, job: KmsJob<A, T>): void;
    protected getPrivateKey<T = void>(keyID: string, job: KmsJob<KmsAction, T>): PrivateKeyType;
    private importKeyJob;
    private destroySessionJob;
    private exportSessionJob;
    private importSessionJob;
    private importExportSessionJob;
    private decryptJob;
    private encryptJob;
    private hybridDecryptJob;
    private hybridEncryptJob;
}
