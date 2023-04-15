import type { PrivateKey } from 'openpgp';
import type { Manager } from '../classes';
import type { PrivateKeyID } from '../types';
import type { KeyManagerResult } from './results';
export interface IKeyManager extends Manager {
    decrypt(data: string, privateKeyID: PrivateKeyID): Promise<KeyManagerResult>;
    encrypt(data: string, privateKeyID: PrivateKeyID): Promise<KeyManagerResult>;
    importKey(privateKey: PrivateKey, privateKeyID?: PrivateKeyID): Promise<KeyManagerResult>;
}
