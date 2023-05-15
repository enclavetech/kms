import { type IKMS, type KmsConfig } from '../../shared';
import { KmsWorkerCore } from '../../worker/classes/kms-worker';
import { ClusterAsymmetricNS, ClusterHybridNS, ClusterKeysNS, ClusterSessionNS, ClusterSymmetricNS } from './namespaces';
export declare abstract class KmsClusterCore<T extends KmsWorkerCore> implements IKMS {
    private readonly cluster;
    private currentWorker;
    protected abstract createWorker(config?: KmsConfig): T;
    private readonly doForAll;
    private readonly getNextWorker;
    readonly asymmetric: ClusterAsymmetricNS<T>;
    readonly hybrid: ClusterHybridNS<T>;
    readonly keys: ClusterKeysNS<T>;
    readonly session: ClusterSessionNS<T>;
    readonly symmetric: ClusterSymmetricNS<T>;
    constructor(config?: KmsConfig);
}
