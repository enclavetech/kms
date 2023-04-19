import { PrivateKey } from 'openpgp';
import { KeyManagerConfig, KeyManagerDecryptResult, KeyManagerEncryptResult, KeyManagerExportSessionResult, KeyManagerImportKeyResult, KeyManagerImportSessionResult } from '../../interfaces';
import { PrivateKeyID } from '../../types';
export declare abstract class KeyManager {
    protected abstract readonly config: KeyManagerConfig;
    private idCounter;
    protected getNextID(): PrivateKeyID;
    abstract importKey(privateKey: PrivateKey, privateKeyID?: string | undefined): Promise<KeyManagerImportKeyResult>;
    abstract exportSession(): Promise<KeyManagerExportSessionResult>;
    abstract importSession(sessionPayload: string): Promise<KeyManagerImportSessionResult>;
    abstract decrypt(privateKeyID: string, data: string): Promise<KeyManagerDecryptResult>;
    abstract encrypt(privateKeyID: string, data: string): Promise<KeyManagerEncryptResult>;
}
