import { KmsClusterCore } from '@enclavetech/kms-core';
import { KmsWorker } from './kms-worker';

export class KmsCluster extends KmsClusterCore<KmsWorker> {
  protected createWorker(): KmsWorker {
    return new KmsWorker();
  }
}
