import type { KeyManagerConfig, KeyManagerDecryptResult, KeyManagerDestroySessionResult, KeyManagerEncryptResult, KeyManagerExportSessionResult, KeyManagerHybridDecryptResult, KeyManagerHybridEncryptResult, KeyManagerImportKeyResult, KeyManagerImportSessionResult } from '../../interfaces';
import { PrivateKeyID } from '../../types';
export declare abstract class KeyManager {
    protected abstract readonly config: KeyManagerConfig;
    private idCounter;
    protected getNextID(): PrivateKeyID;
    abstract importKey(armoredKey: string, privateKeyID?: string | undefined): Promise<KeyManagerImportKeyResult>;
    abstract destroySession(): Promise<KeyManagerDestroySessionResult>;
    abstract exportSession(): Promise<KeyManagerExportSessionResult>;
    abstract importSession(sessionPayload: string): Promise<KeyManagerImportSessionResult>;
    abstract decrypt(privateKeyID: string, data: string): Promise<KeyManagerDecryptResult>;
    abstract encrypt(privateKeyID: string, data: string): Promise<KeyManagerEncryptResult>;
    abstract hybridDecrypt(message: string, messageKey: string, privateKeyID: string): Promise<KeyManagerHybridDecryptResult>;
    abstract hybridEncrypt(data: string, privateKeyID: string): Promise<KeyManagerHybridEncryptResult>;
}
