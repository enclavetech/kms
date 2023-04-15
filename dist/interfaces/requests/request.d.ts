import type { KeyManagerAction, PrivateKeyID } from '../../types';
/**
 * Base interface for a KeyManager request.
 * These interfaces define the shape of the data
 * that users supply when interacting with this package.
 */
export interface KeyManagerRequest<Action extends KeyManagerAction, Data> {
    action: Action;
    data: Data;
    privateKeyID: PrivateKeyID;
}
