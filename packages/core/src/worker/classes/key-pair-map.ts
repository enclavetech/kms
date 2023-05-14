import { EnclaveKmsActionError } from '../../shared/errors/enclave-kms-action.error';
import type { Action, Job } from '../../shared/types';
import type { KeyPair } from '../interfaces/key-pair';

export class KeyPairMap<PrivateKeyType extends object, PublicKeyType extends object>
  implements Iterable<[string, KeyPair<PrivateKeyType, PublicKeyType>]>
{
  private keyPairMap: Record<string, KeyPair<PrivateKeyType, PublicKeyType>> = {};

  *[Symbol.iterator](): Iterator<[string, KeyPair<PrivateKeyType, PublicKeyType>]> {
    const entries = Object.entries(this.keyPairMap);
    let counter = 0;

    while (counter < entries.length) {
      yield entries[counter++];
    }
  }

  clear(): void {
    this.keyPairMap = {};
  }

  get(id: string, job: Job<Action>): KeyPair<PrivateKeyType, PublicKeyType> {
    const keyPair = this.keyPairMap[id];

    if (!keyPair) {
      throw new EnclaveKmsActionError(job.action, `Key pair with ID ${id} not found`);
    }

    return keyPair;
  }

  getPrivateKey(id: string, job: Job<Action>): PrivateKeyType {
    const { privateKey } = this.get(id, job);

    if (!privateKey) {
      throw new EnclaveKmsActionError(job.action, `We do not have the private key for key pair ID ${id}`);
    }

    return privateKey;
  }

  getPublicKey(id: string, job: Job<Action>): PublicKeyType {
    return this.get(id, job).publicKey;
  }

  set(id: string, keyPair: KeyPair<PrivateKeyType, PublicKeyType>): void {
    this.keyPairMap[id] = keyPair;
  }
}
