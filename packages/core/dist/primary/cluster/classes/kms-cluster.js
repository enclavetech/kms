import { DEFAULT_CONFIG } from '../../shared';
import { KmsWorkerCore } from '../../worker/classes/kms-worker';
import { ClusterAsymmetricNS, ClusterHybridNS, ClusterKeysNS, ClusterSessionNS, ClusterSymmetricNS, } from './namespaces';
// TODO: return results for all workers rather than just one
export class KmsClusterCore {
    constructor(config) {
        this.cluster = new Array();
        this.currentWorker = 0;
        this.doForAll = (async (fn) => {
            return (await Promise.all(this.cluster.map(fn)))[0];
        }).bind(this);
        this.getNextWorker = (() => {
            return this.cluster[(this.currentWorker = ++this.currentWorker >= this.cluster.length ? 0 : this.currentWorker)];
        }).bind(this);
        this.asymmetric = new ClusterAsymmetricNS(this.getNextWorker);
        this.hybrid = new ClusterHybridNS(this.getNextWorker);
        this.keys = new ClusterKeysNS(this.doForAll);
        this.session = new ClusterSessionNS(this.getNextWorker, this.doForAll);
        this.symmetric = new ClusterSymmetricNS(this.getNextWorker);
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
