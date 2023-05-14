import type * as Payloads from '../../shared/interfaces/payloads';
import { DEFAULT_CONFIG } from '../constants/default-config';
import type { KmsConfig } from '../interfaces/kms-config';
import { KMS } from './kms';
import { KmsWorkerCore } from './kms-worker';

// TODO: return result for all workers rather than just one

export abstract class KmsClusterCore<T extends KmsWorkerCore> extends KMS {
  protected abstract createWorker(config: KmsConfig): T;

  private readonly cluster = new Array<T>();
  private currentWorker = 0;

  constructor(protected readonly config: KmsConfig = DEFAULT_CONFIG) {
    super();

    const clusterSize = config.clusterSize ?? DEFAULT_CONFIG.clusterSize;

    if (!clusterSize || clusterSize <= 0) {
      throw 'Enclave KMS: Invalid clusterSize.';
    }

    for (let i = 0; i < clusterSize; i++) {
      this.cluster.push(this.createWorker(config));
    }
  }

  private getNextWorker(): T {
    return this.cluster[(this.currentWorker = ++this.currentWorker >= this.cluster.length ? 0 : this.currentWorker)];
  }

  public asymmetricDecrypt(request: Payloads.CryptPayload): Promise<Payloads.DecryptResult> {
    return this.getNextWorker().asymmetricDecrypt(request);
  }

  public asymmetricEncrypt(request: Payloads.CryptPayload): Promise<Payloads.CryptPayload> {
    return this.getNextWorker().asymmetricEncrypt(request);
  }

  public async destroySession(): Promise<void> {
    return (await Promise.all(this.cluster.map((worker) => worker.destroySession())))[0];
  }

  public exportSession(): Promise<Payloads.ExportSessionResult> {
    return this.getNextWorker().exportSession();
  }

  public hybridDecrypt(request: Payloads.HybridDecryptRequest): Promise<Payloads.DecryptResult> {
    return this.getNextWorker().hybridDecrypt(request);
  }

  public hybridEncrypt(request: Payloads.CryptPayload): Promise<Payloads.HybridEncryptResult> {
    return this.getNextWorker().hybridEncrypt(request);
  }

  public async importKeys(...request: Payloads.ImportKeyRequest[]): Promise<Payloads.ImportKeysResult[]> {
    return (await Promise.all(this.cluster.map((worker) => worker.importKeys(...request))))[0];
  }

  public async importSession<T extends boolean>(
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

  public reencryptSessionKey(request: Payloads.ReencryptSessionKeyRequest): Promise<Payloads.CryptPayload> {
    return this.getNextWorker().reencryptSessionKey(request);
  }
}
