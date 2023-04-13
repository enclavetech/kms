import { PrivateKey, PrivateKeyID } from '../types';
import { KeyManagerResult } from './results';

export interface IKeyManager {
  decrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult>;
  encrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult>;
  put(privateKeyID: PrivateKeyID, armoredKey: PrivateKey): Promise<KeyManagerResult>;
}
