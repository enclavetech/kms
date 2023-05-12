import { DEFAULT_CONFIG } from '../constants/default-config';
import type { KmsConfig } from '../interfaces/configs/kms-config';
import type * as Payload from '../interfaces/payloads';
import { KMS } from './kms';
import { KmsWorkerCore } from './kms-worker';

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

  public asymmetricDecrypt(request: Payload.CryptPayload): Promise<Payload.DecryptResult> {
    return this.getNextWorker().asymmetricDecrypt(request);
  }

  public asymmetricEncrypt(request: Payload.CryptPayload): Promise<Payload.CryptPayload> {
    return this.getNextWorker().asymmetricEncrypt(request);
  }

  public async destroySession(): Promise<void> {
    return (await Promise.all(this.cluster.map((worker) => worker.destroySession())))[0];
  }

  public exportSession(): Promise<Payload.ExportSessionResult> {
    return this.getNextWorker().exportSession();
  }

  public hybridDecrypt(request: Payload.HybridDecryptRequest): Promise<Payload.DecryptResult> {
    return this.getNextWorker().hybridDecrypt(request);
  }

  public hybridEncrypt(request: Payload.CryptPayload): Promise<Payload.HybridEncryptResult> {
    return this.getNextWorker().hybridEncrypt(request);
  }

  public async importPrivateKey(request: Payload.ImportPrivateKeyRequest): Promise<Payload.ImportPrivateKeyResult> {
    return (await Promise.all(this.cluster.map((worker) => worker.importPrivateKey(request))))[0];
  }

  public async importSession(request: Payload.ImportSessionRequest): Promise<Payload.ImportSessionResult> {
    return (await Promise.all(this.cluster.map((worker) => worker.importSession(request))))[0];
  }

  public reencryptSessionKey(request: Payload.ReencryptSessionKeyRequest): Promise<Payload.CryptPayload> {
    return this.getNextWorker().reencryptSessionKey(request);
  }
}
