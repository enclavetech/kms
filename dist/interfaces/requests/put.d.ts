import type { PrivateKey, PrivateKeyID } from '../../types';
export interface KeyManagerPutRequest {
    action: 'put';
    data: PrivateKey;
    privateKeyID?: PrivateKeyID;
}
