import { DEFAULT_CONFIG, type IKMS, type KmsConfig } from '../../shared';
import { KmsWorkerCore } from '../../worker/classes/kms-worker';
import {
  ClusterAsymmetricNS,
  ClusterHybridNS,
  ClusterKeysNS,
  ClusterSessionNS,
  ClusterSymmetricNS,
} from './namespaces';

// TODO: return results for all workers rather than just one

export abstract class KmsClusterCore<T extends KmsWorkerCore> implements IKMS {
  private readonly cluster = new Array<T>();
  private currentWorker = 0;

  protected abstract createWorker(config?: KmsConfig): T;

  private readonly doForAll = (async <fnReturn extends Promise<unknown>>(
    fn: (worker: T) => fnReturn,
  ): Promise<Awaited<fnReturn>> => {
    return (await Promise.all(this.cluster.map(fn)))[0];
  }).bind(this);

  private readonly getNextWorker = ((): T => {
    return this.cluster[(this.currentWorker = ++this.currentWorker >= this.cluster.length ? 0 : this.currentWorker)];
  }).bind(this);

  readonly asymmetric = new ClusterAsymmetricNS<T>(this.getNextWorker);
  readonly hybrid = new ClusterHybridNS<T>(this.getNextWorker);
  readonly keys = new ClusterKeysNS<T>(this.doForAll);
  readonly session = new ClusterSessionNS<T>(this.getNextWorker, this.doForAll);
  readonly symmetric = new ClusterSymmetricNS<T>(this.getNextWorker);

  constructor(config?: KmsConfig) {
    const clusterSize = config?.clusterSize ?? DEFAULT_CONFIG.clusterSize;

    if (!clusterSize || clusterSize <= 0) {
      // TODO: custom error class
      throw 'Enclave KMS: Invalid clusterSize.';
    }

    for (let i = 0; i < clusterSize; i++) {
      this.cluster.push(this.createWorker(config));
    }
  }
}
