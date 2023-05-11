import { DEFAULT_CONFIG } from '../constants/default-config';
import type { KmsConfig } from '../interfaces/configs/kms-config';
import type { CryptOpPayloadData } from '../interfaces/payload-data/crypt-op';
import type { HybridDecryptRequestPayloadData } from '../interfaces/payload-data/hybrid-decrypt-request';
import type { KeyImportRequestPayloadData } from '../interfaces/payload-data/key-import-request';
import type {
  DecryptResult,
  EncryptResult,
  HybridDecryptResult,
  HybridEncryptResult,
  KeyImportResult,
  SessionDestroyResult,
  SessionExportResult,
  SessionImportExportResult,
  SessionImportResult,
} from '../types/result';
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
    return this.cluster[
      (this.currentWorker = ++this.currentWorker >= this.cluster.length ? 0 : this.currentWorker)
    ];
  }

  public async importKey(payload: KeyImportRequestPayloadData): Promise<KeyImportResult> {
    return (await Promise.all(this.cluster.map((worker) => worker.importKey(payload))))[0];
  }

  public async destroySession(): Promise<SessionDestroyResult> {
    return (await Promise.all(this.cluster.map((worker) => worker.destroySession())))[0];
  }

  public exportSession(): Promise<SessionExportResult> {
    return this.getNextWorker().exportSession();
  }

  public async importSession(payload: string): Promise<SessionImportResult> {
    return (await Promise.all(this.cluster.map((worker) => worker.importSession(payload))))[0];
  }

  public async importExportSession(payload: string): Promise<SessionImportExportResult> {
    const nextWorker = this.getNextWorker();
    const importResultPromise = nextWorker.importExportSession(payload);
    console.log(
      await Promise.all(
        this.cluster.map((worker) =>
          worker === nextWorker ? importResultPromise : worker.importSession(payload),
        ),
      ),
    );
    return await importResultPromise;
  }

  public decrypt(payload: CryptOpPayloadData): Promise<DecryptResult> {
    return this.getNextWorker().decrypt(payload);
  }

  public encrypt(payload: CryptOpPayloadData): Promise<EncryptResult> {
    return this.getNextWorker().encrypt(payload);
  }

  public hybridDecrypt(payload: HybridDecryptRequestPayloadData): Promise<HybridDecryptResult> {
    return this.getNextWorker().hybridDecrypt(payload);
  }

  public hybridEncrypt(payload: CryptOpPayloadData): Promise<HybridEncryptResult> {
    return this.getNextWorker().hybridEncrypt(payload);
  }
}
