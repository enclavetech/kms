import type { PrivateKey } from 'openpgp';
import type { IKeyManager, KeyManagerConfig, KeyManagerResult } from '../../interfaces';
import type { PrivateKeyID } from '../../types';
import { Manager } from './manager';
export declare class KeyWorkerCluster extends Manager implements IKeyManager {
    private readonly cluster;
    private currentWorker;
    constructor(config?: KeyManagerConfig);
    private getNextWorker;
    decrypt(data: string, privateKeyID: PrivateKeyID): Promise<KeyManagerResult>;
    encrypt(data: string, privateKeyID: PrivateKeyID): Promise<KeyManagerResult>;
    put(privateKey: PrivateKey, privateKeyID?: PrivateKeyID): Promise<KeyManagerResult>;
}
