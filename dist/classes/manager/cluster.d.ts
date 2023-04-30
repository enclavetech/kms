import type { KeyManagerConfig, KeyManagerDecryptResult, KeyManagerDestroySessionResult, KeyManagerEncryptResult, KeyManagerExportSessionResult, KeyManagerHybridDecryptResult, KeyManagerHybridEncryptResult, KeyManagerImportKeyResult, KeyManagerImportSessionResult } from '../../interfaces';
import type { PrivateKeyID } from '../../types';
import { KeyManager } from './manager';
export declare class KeyWorkerClusterManager extends KeyManager {
    protected readonly config: KeyManagerConfig;
    private readonly cluster;
    private currentWorker;
    constructor(config?: KeyManagerConfig);
    private getNextWorker;
    importKey(armoredKey: string, keyID?: PrivateKeyID): Promise<KeyManagerImportKeyResult>;
    destroySession(): Promise<KeyManagerDestroySessionResult>;
    exportSession(): Promise<KeyManagerExportSessionResult>;
    importSession(sessionPayload: string): Promise<KeyManagerImportSessionResult>;
    decrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerDecryptResult>;
    encrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerEncryptResult>;
    hybridDecrypt(message: string, messageKey: string, privateKeyID: string): Promise<KeyManagerHybridDecryptResult>;
    hybridEncrypt(data: string, privateKeyID: string): Promise<KeyManagerHybridEncryptResult>;
}
