import type { IKeyManager, KeyManagerConfig, KeyManagerResult } from '../../interfaces';
import type { PrivateKey, PrivateKeyID } from '../../types';
import { Manager } from './manager';
export declare class KeyWorkerCluster extends Manager implements IKeyManager {
    private readonly cluster;
    private currentWorker;
    constructor(config?: KeyManagerConfig);
    private getNextWorker;
    decrypt(data: string, privateKeyID: PrivateKeyID): Promise<KeyManagerResult>;
    encrypt(data: string, privateKeyID: PrivateKeyID): Promise<KeyManagerResult>;
    put(armoredKey: PrivateKey, privateKeyID?: PrivateKeyID): Promise<KeyManagerResult>;
}
