import type { Action, Request, Result } from '../../shared/types';
import { DEFAULT_CONFIG } from '../constants/default-config';
import type { KmsConfig } from '../interfaces/kms-config';
import { ManagedWorker } from './managed-worker';

export class KMS {
  private readonly cluster: ManagedWorker[];

  private currentWorker = 0;

  readonly asymmetric;
  readonly hybrid;
  readonly keys;
  readonly session;
  readonly symmetric;

  constructor(workerConstructor: () => Worker, config?: KmsConfig) {
    const clusterSize = config?.clusterSize ?? DEFAULT_CONFIG.clusterSize;

    if (!clusterSize || clusterSize <= 0) {
      // TODO: custom error class
      throw 'Enclave KMS: Invalid clusterSize.';
    }

    this.cluster = Array.from({ length: clusterSize }, () => new ManagedWorker(workerConstructor()));

    if (config?.asymmetric) this.asymmetric = new config.asymmetric(this.postJobSingle, this.postJobAll);
    if (config?.hybrid) this.hybrid = new config.hybrid(this.postJobSingle, this.postJobAll);
    if (config?.keys) this.keys = new config.keys(this.postJobSingle, this.postJobAll);
    if (config?.session) this.session = new config.session(this.postJobSingle, this.postJobAll);
    if (config?.symmetric) this.symmetric = new config.symmetric(this.postJobSingle, this.postJobAll);
  }

  private readonly postJobSingle = (async <T extends Action>(request: Request<T>): Promise<Result<T>> => {
    return this.cluster[
      (this.currentWorker = ++this.currentWorker >= this.cluster.length ? 0 : this.currentWorker)
    ].postJob(request);
  }).bind(this);

  private readonly postJobAll = (async <T extends Action>(request: Request<T>): Promise<Result<T>[]> => {
    return Promise.all(this.cluster.map((managedWorker) => managedWorker.postJob(request)));
  }).bind(this);
}
