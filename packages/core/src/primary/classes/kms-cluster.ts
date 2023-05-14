import type * as Payloads from '../../shared/interfaces/payloads';
import { DEFAULT_CONFIG } from '../constants/default-config';
import type { KMS, KmsConfig } from '../interfaces';
import { KmsWorkerCore } from './kms-worker';

// TODO: return results for all workers rather than just one

export abstract class KmsClusterCore<T extends KmsWorkerCore> implements KMS {
  protected abstract createWorker(): T;

  private readonly cluster = new Array<T>();
  private currentWorker = 0;

  constructor(config: KmsConfig = DEFAULT_CONFIG) {
    const clusterSize = config.clusterSize ?? DEFAULT_CONFIG.clusterSize;

    if (!clusterSize || clusterSize <= 0) {
      throw 'Enclave KMS: Invalid clusterSize.';
    }

    for (let i = 0; i < clusterSize; i++) {
      this.cluster.push(this.createWorker());
    }
  }

  private getNextWorker(): T {
    return this.cluster[(this.currentWorker = ++this.currentWorker >= this.cluster.length ? 0 : this.currentWorker)];
  }

  asymmetricDecrypt(request: Payloads.AsymmetricCryptPayload): Promise<Payloads.CryptResult> {
    return this.getNextWorker().asymmetricDecrypt(request);
  }

  asymmetricEncrypt(request: Payloads.AsymmetricCryptPayload): Promise<Payloads.AsymmetricCryptPayload> {
    return this.getNextWorker().asymmetricEncrypt(request);
  }

  async destroySession(): Promise<void> {
    return (await Promise.all(this.cluster.map((worker) => worker.destroySession())))[0];
  }

  exportSession(): Promise<Payloads.ExportSessionResult> {
    return this.getNextWorker().exportSession();
  }

  hybridDecrypt(request: Payloads.HybridDecryptRequest): Promise<Payloads.CryptResult> {
    return this.getNextWorker().hybridDecrypt(request);
  }

  hybridEncrypt(request: Payloads.AsymmetricCryptPayload): Promise<Payloads.HybridEncryptResult> {
    return this.getNextWorker().hybridEncrypt(request);
  }

  async importKeys(...request: Payloads.ImportKeyRequest[]): Promise<Payloads.ImportKeysResult[]> {
    return (await Promise.all(this.cluster.map((worker) => worker.importKeys(...request))))[0];
  }

  async importSession<T extends boolean>(
    request: Payloads.ImportSessionRequest<T>,
  ): Promise<Payloads.ImportSessionResult<T>> {
    const [importSessionResult] = await Promise.all(
      this.cluster.map((worker) => worker.importSession({ ...request, reexport: false })),
    );

    return (
      request.reexport
        ? {
            ...importSessionResult,
            ...(await this.exportSession()),
            reexported: true,
          }
        : importSessionResult
    ) as Payloads.ImportSessionResult<T>;
  }

  reencryptSessionKey(request: Payloads.ReencryptSessionKeyRequest): Promise<Payloads.AsymmetricCryptPayload> {
    return this.getNextWorker().reencryptSessionKey(request);
  }

  symmetricDecrypt(request: Payloads.SymmetricCryptPayload): Promise<Payloads.CryptResult> {
    return this.getNextWorker().symmetricDecrypt(request);
  }

  symmetricEncrypt(request: Payloads.SymmetricCryptPayload): Promise<Payloads.CryptResult> {
    return this.getNextWorker().symmetricEncrypt(request);
  }
}
