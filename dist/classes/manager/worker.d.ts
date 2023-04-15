import type { IKeyManager, KeyManagerConfig, KeyManagerResult } from '../../interfaces';
import type { PrivateKey, PrivateKeyID } from '../../types';
export declare class KeyWorker implements IKeyManager {
    private readonly worker;
    private readonly pendingJobs;
    private jobCounter;
    constructor(config?: KeyManagerConfig);
    private doJob;
    decrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult>;
    encrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult>;
    put(privateKeyID: PrivateKeyID, armoredKey: PrivateKey): Promise<KeyManagerResult>;
}
