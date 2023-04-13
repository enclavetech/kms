import type { IKeyManager, KeyManagerResult } from '../interfaces';
import type { PrivateKey, PrivateKeyID } from '../types';
export declare class ClusterManager implements IKeyManager {
    private readonly cluster;
    private currentWorker;
    constructor(clusterCount?: number);
    private getNextWorker;
    decrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult>;
    encrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult>;
    put(privateKeyID: PrivateKeyID, armoredKey: PrivateKey): Promise<KeyManagerResult>;
}
