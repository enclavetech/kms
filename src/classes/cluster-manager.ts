import type { IKeyManager, KeyManagerResult } from '../interfaces';
import type { PrivateKey, PrivateKeyID } from '../types';
import { WorkerManager } from './worker-manager';

// TODO: make an abstract API for this and `WorkerManager`

export class ClusterManager implements IKeyManager {
  private readonly cluster = new Array<WorkerManager>();
  private currentWorker = 0;

  constructor(clusterCount = 1) {
    if (clusterCount <= 0) {
      throw 'Invalid cluster count';
    }

    for (let i = 0; i < clusterCount; i++) {
      this.cluster.push(new WorkerManager());
    }
  }

  private getNextWorker(): WorkerManager {
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
