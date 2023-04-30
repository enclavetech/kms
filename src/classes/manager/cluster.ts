import { DEFAULT_CONFIG } from '../../constants';
import type {
  IHybridJobData,
  KeyManagerConfig,
  KeyManagerDecryptResult,
  KeyManagerDestroySessionResult,
  KeyManagerEncryptResult,
  KeyManagerExportSessionResult,
  KeyManagerHybridDecryptResult,
  KeyManagerHybridEncryptResult,
  KeyManagerImportKeyResult,
  KeyManagerImportSessionResult,
} from '../../interfaces';
import type { PrivateKeyID } from '../../types';
import { KeyManager } from './manager';
import { KeyWorkerManager } from './worker';

export class KeyWorkerClusterManager extends KeyManager {
  private readonly cluster = new Array<KeyWorkerManager>();
  private currentWorker = 0;

  constructor(protected readonly config: KeyManagerConfig = DEFAULT_CONFIG) {
    super();

    const clusterSize = this.config.clusterSize ?? DEFAULT_CONFIG.clusterSize;

    if (!clusterSize || clusterSize <= 0) {
      throw 'Invalid cluster size';
    }

    for (let i = 0; i < clusterSize; i++) {
      this.cluster.push(new KeyWorkerManager());
    }
  }

  private getNextWorker(): KeyWorkerManager {
    return this.cluster[
      (this.currentWorker = ++this.currentWorker >= this.cluster.length ? 0 : this.currentWorker)
    ];
  }

  public async importKey(
    armoredKey: string,
    keyID: PrivateKeyID = this.getNextID()
  ): Promise<KeyManagerImportKeyResult> {
    return (await Promise.all(this.cluster.map((worker) => worker.importKey(armoredKey, keyID))))[0];
  }

  public async destroySession(): Promise<KeyManagerDestroySessionResult> {
    return (await Promise.all(this.cluster.map((worker) => worker.destroySession())))[0];
  }

  public exportSession(): Promise<KeyManagerExportSessionResult> {
    return this.getNextWorker().exportSession();
  }

  public async importSession(sessionPayload: string): Promise<KeyManagerImportSessionResult> {
    return (await Promise.all(this.cluster.map((worker) => worker.importSession(sessionPayload))))[0];
  }

  public decrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerDecryptResult> {
    return this.getNextWorker().decrypt(privateKeyID, data);
  }

  public encrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerEncryptResult> {
    return this.getNextWorker().encrypt(privateKeyID, data);
  }

  public hybridDecrypt(
    message: string,
    messageKey: string,
    privateKeyID: string
  ): Promise<KeyManagerHybridDecryptResult> {
    return this.getNextWorker().hybridDecrypt(message, messageKey, privateKeyID);
  }

  public hybridEncrypt(data: string, privateKeyID: string): Promise<KeyManagerHybridEncryptResult> {
    return this.getNextWorker().hybridEncrypt(privateKeyID, data);
  }
}
