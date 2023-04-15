import type { PrivateKey } from 'openpgp';
import { DEFAULT_CONFIG } from '../../constants';
import type { IKeyManager, KeyManagerConfig, KeyManagerResult } from '../../interfaces';
import type { PrivateKeyID } from '../../types';
import { Manager } from './manager';
import { KeyWorker } from './worker';

export class KeyWorkerCluster extends Manager implements IKeyManager {
  private readonly cluster = new Array<KeyWorker>();
  private currentWorker = 0;

  constructor(config: KeyManagerConfig = DEFAULT_CONFIG) {
    super();
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

  decrypt(data: string, privateKeyID: PrivateKeyID): Promise<KeyManagerResult> {
    return this.getNextWorker().decrypt(privateKeyID, data);
  }

  encrypt(data: string, privateKeyID: PrivateKeyID): Promise<KeyManagerResult> {
    return this.getNextWorker().encrypt(privateKeyID, data);
  }

  async put(privateKey: PrivateKey, privateKeyID?: PrivateKeyID): Promise<KeyManagerResult> {
    if (!privateKeyID) privateKeyID = this.getNextID();
    return Promise.all(this.cluster.map((worker) => worker.put(privateKey, privateKeyID))).then(
      (results) => results[0]
    );
  }
}
