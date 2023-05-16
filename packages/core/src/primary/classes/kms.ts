import type { Action, Request, Result } from '../../shared/types';
import { DEFAULT_CONFIG } from '../constants/default-config';
import type { KmsConfig } from '../interfaces/kms-config';
import { ManagedWorker } from './managed-worker';
import { AsymmetricNS, HybridNS, KeysNS, SessionNS, SymmetricNS } from './namespaces';

export abstract class KMS {
  private readonly cluster: ManagedWorker[];

  private currentWorker = 0;

  constructor(workerConstructor: () => Worker, config?: KmsConfig) {
    const clusterSize = config?.clusterSize ?? DEFAULT_CONFIG.clusterSize;

    if (!clusterSize || clusterSize <= 0) {
      // TODO: custom error class
      throw 'Enclave KMS: Invalid clusterSize.';
    }

    this.cluster = Array.from({ length: clusterSize }, () => new ManagedWorker(workerConstructor()));
  }

  private readonly postJobSingle = (async <T extends Action>(request: Request<T>): Promise<Result<T>> => {
    return this.cluster[
      (this.currentWorker = ++this.currentWorker >= this.cluster.length ? 0 : this.currentWorker)
    ].postJob(request);
  }).bind(this);

  private readonly postJobAll = (async <T extends Action>(request: Request<T>): Promise<Result<T>[]> => {
    return Promise.all(this.cluster.map((managedWorker) => managedWorker.postJob(request)));
  }).bind(this);

  // TODO: tree shakability - user able to inject only ones they need
  readonly asymmetric = new AsymmetricNS(this.postJobSingle, this.postJobAll);
  readonly hybrid = new HybridNS(this.postJobSingle, this.postJobAll);
  readonly keys = new KeysNS(this.postJobSingle, this.postJobAll);
  readonly session = new SessionNS(this.postJobSingle, this.postJobAll);
  readonly symmetric = new SymmetricNS(this.postJobSingle, this.postJobAll);
}
