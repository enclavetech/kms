import type { PrivateKey } from 'openpgp';
import type { PrivateKeyID } from '../types';
export declare class PrivateKeyMap extends Map<PrivateKeyID, PrivateKey> {
    constructor();
    get(privateKeyID: PrivateKeyID): PrivateKey | undefined;
    set(privateKeyID: PrivateKeyID, privateKey: PrivateKey): this;
}
