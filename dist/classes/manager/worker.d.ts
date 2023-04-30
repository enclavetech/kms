import type { KeyManagerConfig, KeyManagerDecryptResult, KeyManagerDestroySessionResult, KeyManagerEncryptResult, KeyManagerExportSessionResult, KeyManagerHybridDecryptResult, KeyManagerHybridEncryptResult, KeyManagerImportKeyResult, KeyManagerImportSessionResult } from '../../interfaces';
import type { PrivateKeyID } from '../../types';
import { KeyManager } from './manager';
export declare class KeyWorkerManager extends KeyManager {
    protected readonly config: KeyManagerConfig;
    private readonly worker;
    private readonly pendingJobs;
    private jobCounter;
    constructor(config?: KeyManagerConfig);
    private doJob;
    importKey(data: string, keyID?: PrivateKeyID): Promise<KeyManagerImportKeyResult>;
    destroySession(): Promise<KeyManagerDestroySessionResult>;
    exportSession(): Promise<KeyManagerExportSessionResult>;
    importSession(data: string): Promise<KeyManagerImportSessionResult>;
    decrypt(keyID: PrivateKeyID, data: string): Promise<KeyManagerDecryptResult>;
    encrypt(keyID: PrivateKeyID, data: string): Promise<KeyManagerEncryptResult>;
    hybridDecrypt(message: string, key: string, keyID: string): Promise<KeyManagerHybridDecryptResult>;
    hybridEncrypt(data: string, keyID: string): Promise<KeyManagerHybridEncryptResult>;
}
