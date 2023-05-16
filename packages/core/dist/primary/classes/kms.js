import { DEFAULT_CONFIG } from '../constants/default-config';
import { ManagedWorker } from './managed-worker';
import { AsymmetricNS, HybridNS, KeysNS, SessionNS, SymmetricNS } from './namespaces';
export class KMS {
    constructor(workerConstructor, config) {
        this.currentWorker = 0;
        this.postJobSingle = (async (request) => {
            return this.cluster[(this.currentWorker = ++this.currentWorker >= this.cluster.length ? 0 : this.currentWorker)].postJob(request);
        }).bind(this);
        this.postJobAll = (async (request) => {
            return Promise.all(this.cluster.map((managedWorker) => managedWorker.postJob(request)));
        }).bind(this);
        // TODO: tree shakability - user able to inject only ones they need
        this.asymmetric = new AsymmetricNS(this.postJobSingle, this.postJobAll);
        this.hybrid = new HybridNS(this.postJobSingle, this.postJobAll);
        this.keys = new KeysNS(this.postJobSingle, this.postJobAll);
        this.session = new SessionNS(this.postJobSingle, this.postJobAll);
        this.symmetric = new SymmetricNS(this.postJobSingle, this.postJobAll);
        const clusterSize = config?.clusterSize ?? DEFAULT_CONFIG.clusterSize;
        if (!clusterSize || clusterSize <= 0) {
            // TODO: custom error class
            throw 'Enclave KMS: Invalid clusterSize.';
        }
        this.cluster = Array.from({ length: clusterSize }, () => new ManagedWorker(workerConstructor()));
    }
}
