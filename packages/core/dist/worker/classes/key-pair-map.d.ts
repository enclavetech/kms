import type { Action, Job } from '../../shared/types';
import type { KeyPair } from '../interfaces/key-pair';
export declare class KeyPairMap<PrivateKeyType, PublicKeyType> implements Iterable<[string, KeyPair<PrivateKeyType, PublicKeyType>]> {
    private keyPairMap;
    [Symbol.iterator](): Iterator<[string, KeyPair<PrivateKeyType, PublicKeyType>]>;
    clear(): void;
    get(id: string, job: Job<Action>): KeyPair<PrivateKeyType, PublicKeyType>;
    getPrivateKey(id: string, job: Job<Action>): PrivateKeyType;
    getPublicKey(id: string, job: Job<Action>): PublicKeyType;
    set(id: string, keyPair: KeyPair<PrivateKeyType, PublicKeyType>): void;
}
