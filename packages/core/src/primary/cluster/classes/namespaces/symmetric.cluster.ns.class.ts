import type { CryptResult, SymmetricCryptPayload } from '../../../../shared/interfaces/payloads';
import type { KmsWorkerCore } from '../../../worker/classes/kms-worker';
import type { ISymmetricNS } from '../../../shared/interfaces/namespaces';

export class ClusterSymmetricNS<T extends KmsWorkerCore> implements ISymmetricNS {
  constructor(private readonly getNextWorker: () => T) {}

  decrypt(request: SymmetricCryptPayload): Promise<CryptResult> {
    return this.getNextWorker().symmetric.decrypt(request);
  }

  encrypt(request: SymmetricCryptPayload): Promise<CryptResult> {
    return this.getNextWorker().symmetric.encrypt(request);
  }
}
