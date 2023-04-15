import type { PrivateKey } from 'openpgp';
import type { IKeyManager, KeyManagerConfig, KeyManagerResult } from '../../interfaces';
import type { PrivateKeyID } from '../../types';
import { Manager } from './manager';
export declare class KeyWorker extends Manager implements IKeyManager {
    private readonly worker;
    private readonly pendingJobs;
    private jobCounter;
    constructor(config?: KeyManagerConfig);
    private doJob;
    decrypt(data: string, privateKeyID: PrivateKeyID): Promise<KeyManagerResult>;
    encrypt(data: string, privateKeyID: PrivateKeyID): Promise<KeyManagerResult>;
    importKey(privateKey: PrivateKey, privateKeyID?: PrivateKeyID): Promise<KeyManagerResult>;
}
