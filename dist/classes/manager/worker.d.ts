import type { PrivateKey } from 'openpgp';
import type { KeyManagerConfig, KeyManagerDecryptResult, KeyManagerEncryptResult, KeyManagerImportKeyResult, KeyManagerExportSessionResult, KeyManagerImportSessionResult } from '../../interfaces';
import type { PrivateKeyID } from '../../types';
import { KeyManager } from './manager';
export declare class KeyWorkerManager extends KeyManager {
    protected readonly config: KeyManagerConfig;
    private readonly worker;
    private readonly pendingJobs;
    private jobCounter;
    constructor(config?: KeyManagerConfig);
    private doJob;
    importKey(privateKey: PrivateKey, keyID?: PrivateKeyID): Promise<KeyManagerImportKeyResult>;
    exportSession(): Promise<KeyManagerExportSessionResult>;
    importSession(data: string): Promise<KeyManagerImportSessionResult>;
    decrypt(data: string, keyID: PrivateKeyID): Promise<KeyManagerDecryptResult>;
    encrypt(data: string, keyID: PrivateKeyID): Promise<KeyManagerEncryptResult>;
}
