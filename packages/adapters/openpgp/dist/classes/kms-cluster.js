import { KmsClusterCore } from '@enclavetech/kms-core';
import { KmsWorker } from './kms-worker';
export class KmsCluster extends KmsClusterCore {
    createWorker() {
        return new KmsWorker();
    }
}
