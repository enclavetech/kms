import { PrivateKey } from 'openpgp';
import {
  KeyManagerConfig,
  KeyManagerDecryptResult,
  KeyManagerEncryptResult,
  KeyManagerImportKeyResult,
} from '../../interfaces';
import { PrivateKeyID } from '../../types';

export abstract class KeyManager {
  protected abstract readonly config: KeyManagerConfig;

  private idCounter = 0;

  protected getNextID(): PrivateKeyID {
    return (this.idCounter++).toString();
  }

  public abstract importKey(
    privateKey: PrivateKey,
    privateKeyID?: string | undefined
  ): Promise<KeyManagerImportKeyResult>;

  public abstract decrypt(privateKeyID: string, data: string): Promise<KeyManagerDecryptResult>;
  public abstract encrypt(privateKeyID: string, data: string): Promise<KeyManagerEncryptResult>;
}
