import type {
  AsymmetricCryptPayload,
  CryptResult,
  HybridDecryptRequest,
  HybridEncryptResult,
  ReencryptSessionKeyRequest,
} from '../../../../shared/interfaces/payloads';
import type { KmsWorkerCore } from '../../../worker/classes/kms-worker';
import type { IHybridNS } from '../../../shared/interfaces/namespaces';

export class ClusterHybridNS<T extends KmsWorkerCore> implements IHybridNS {
  constructor(private readonly getNextWorker: () => T) {}

  decrypt(request: HybridDecryptRequest): Promise<CryptResult> {
    return this.getNextWorker().hybrid.decrypt(request);
  }

  encrypt(request: AsymmetricCryptPayload): Promise<HybridEncryptResult> {
    return this.getNextWorker().hybrid.encrypt(request);
  }

  shareKey(request: ReencryptSessionKeyRequest): Promise<AsymmetricCryptPayload> {
    return this.getNextWorker().hybrid.shareKey(request);
  }
}
