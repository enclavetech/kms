import type { IKeyManager, KeyManagerResult } from '../interfaces';
import type { PrivateKey, PrivateKeyID } from '../types';
export declare class WorkerManager implements IKeyManager {
    private readonly worker;
    private readonly pendingJobs;
    private requestCounter;
    constructor();
    private doJob;
    decrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult>;
    encrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult>;
    put(privateKeyID: PrivateKeyID, armoredKey: PrivateKey): Promise<KeyManagerResult>;
}
