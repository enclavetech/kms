import type { AsymmetricCryptPayload, CryptResult } from '../../../../shared/interfaces/payloads';
import type { IAsymmetricNS } from '../../../shared/interfaces/namespaces';
import type { KmsWorkerCore } from '../../../worker/classes/kms-worker';

export class ClusterAsymmetricNS<T extends KmsWorkerCore> implements IAsymmetricNS {
  constructor(private readonly getNextWorker: () => T) {}

  decrypt(request: AsymmetricCryptPayload): Promise<CryptResult> {
    return this.getNextWorker().asymmetric.decrypt(request);
  }

  encrypt(request: AsymmetricCryptPayload): Promise<AsymmetricCryptPayload> {
    return this.getNextWorker().asymmetric.encrypt(request);
  }
}
