import { KmsClusterCore, type KmsConfig } from '@enclavetech/kms-core';
import { KmsWorker } from './kms-worker';
export declare class KmsCluster extends KmsClusterCore<KmsWorker> {
    protected createWorker(config: KmsConfig): KmsWorker;
}
