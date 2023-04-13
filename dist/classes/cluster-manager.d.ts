import type { KeyManagerResult } from '../interfaces';
import type { PrivateKey, PrivateKeyID } from '../types';
export declare class ClusterManager {
    private readonly cluster;
    private currentWorker;
    constructor(clusterCount?: number);
    private getNextWorker;
    put(privateKeyID: PrivateKeyID, armoredKey: PrivateKey): Promise<KeyManagerResult>;
    decrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult>;
    encrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult>;
}
