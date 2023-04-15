import { DEFAULT_CONFIG } from '../../constants';
import type { IKeyManager, KeyManagerConfig, KeyManagerResult } from '../../interfaces';
import type { PrivateKey, PrivateKeyID } from '../../types';
import { KeyWorker } from './worker';

export class KeyWorkerCluster implements IKeyManager {
  private readonly cluster = new Array<KeyWorker>();
  private currentWorker = 0;

  constructor(config: KeyManagerConfig = DEFAULT_CONFIG) {
    const clusterSize = config.clusterSize ?? DEFAULT_CONFIG.clusterSize;

    if (!clusterSize || clusterSize <= 0) {
      throw 'Invalid cluster size';
    }

    for (let i = 0; i < clusterSize; i++) {
      this.cluster.push(new KeyWorker());
    }
  }

  private getNextWorker(): KeyWorker {
    return this.cluster[
      (this.currentWorker = ++this.currentWorker >= this.cluster.length ? 0 : this.currentWorker)
    ];
  }

  decrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult> {
    return this.getNextWorker().decrypt(privateKeyID, data);
  }

  encrypt(privateKeyID: PrivateKeyID, data: string): Promise<KeyManagerResult> {
    return this.getNextWorker().encrypt(privateKeyID, data);
  }

  async put(privateKeyID: PrivateKeyID, armoredKey: PrivateKey): Promise<KeyManagerResult> {
    return Promise.all(this.cluster.map((worker) => worker.put(privateKeyID, armoredKey))).then(
      (results) => results[0]
    );
  }
}
