import type { PrivateKey } from 'openpgp';
import type { KeyManagerConfig, KeyManagerDecryptResult, KeyManagerEncryptResult, KeyManagerImportKeyResult } from '../../interfaces';
import type { PrivateKeyID } from '../../types';
import { KeyManager } from './manager';
export declare class KeyWorkerClusterManager extends KeyManager {
    protected readonly config: KeyManagerConfig;
    private readonly cluster;
    private currentWorker;
    constructor(config?: KeyManagerConfig);
    private getNextWorker;
    importKey(privateKey: PrivateKey, keyID?: PrivateKeyID): Promise<KeyManagerImportKeyResult>;
    decrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerDecryptResult>;
    encrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerEncryptResult>;
}
