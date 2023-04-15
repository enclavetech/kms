import { Manager } from '../classes/manager/manager';
import { PrivateKey, PrivateKeyID } from '../types';
import { KeyManagerResult } from './results';
export interface IKeyManager extends Manager {
    decrypt(data: string, privateKeyID: PrivateKeyID): Promise<KeyManagerResult>;
    encrypt(data: string, privateKeyID: PrivateKeyID): Promise<KeyManagerResult>;
    put(armoredKey: PrivateKey, privateKeyID?: PrivateKeyID): Promise<KeyManagerResult>;
}
