import type { KeyManagerResult } from '../interfaces';
import type { PrivateKey, PrivateKeyID } from '../types';
export declare class WorkerManager {
    private readonly worker;
    private readonly pendingJobs;
    private requestCounter;
    constructor();
    private doJob;
    put(privateKeyID: PrivateKeyID, armoredKey: PrivateKey): Promise<KeyManagerResult>;
    decrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult>;
    encrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult>;
}
