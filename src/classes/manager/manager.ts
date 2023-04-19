import {
  KeyManagerConfig,
  KeyManagerDecryptResult,
  KeyManagerDestroySessionResult,
  KeyManagerEncryptResult,
  KeyManagerExportSessionResult,
  KeyManagerImportKeyResult,
  KeyManagerImportSessionResult,
} from '../../interfaces';
import { PrivateKeyID } from '../../types';

export abstract class KeyManager {
  protected abstract readonly config: KeyManagerConfig;

  private idCounter = 0;

  protected getNextID(): PrivateKeyID {
    return (this.idCounter++).toString();
  }

  public abstract importKey(
    armoredKey: string,
    privateKeyID?: string | undefined
  ): Promise<KeyManagerImportKeyResult>;

  public abstract destroySession(): Promise<KeyManagerDestroySessionResult>;
  public abstract exportSession(): Promise<KeyManagerExportSessionResult>;
  public abstract importSession(sessionPayload: string): Promise<KeyManagerImportSessionResult>;

  public abstract decrypt(privateKeyID: string, data: string): Promise<KeyManagerDecryptResult>;
  public abstract encrypt(privateKeyID: string, data: string): Promise<KeyManagerEncryptResult>;
}
