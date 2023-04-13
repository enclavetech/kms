import type { PrivateKey, PrivateKeyID } from '../types';
export declare class PrivateKeyMap extends Map<PrivateKeyID, PrivateKey> {
    constructor();
    get(privateKeyID: PrivateKeyID): string | undefined;
    set(privateKeyID: PrivateKeyID, privateKey: PrivateKey): this;
}
