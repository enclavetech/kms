import { KmsClusterCore } from '@enclavetech/kms-core';
import { KmsWorker } from './kms-worker';
export declare class KmsCluster extends KmsClusterCore<KmsWorker> {
    protected createWorker(): KmsWorker;
}
