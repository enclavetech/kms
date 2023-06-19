import { EnclaveKmsError } from '../../shared/errors/enclave-kms.error';
import { DEFAULT_CONFIG } from '../constants/default-config';
import { ManagedWorker } from './managed-worker';
export class KMS {
    constructor(workerConstructor, config) {
        this.currentWorker = 0;
        this.postJobSingle = (async (request) => {
            return this.cluster[(this.currentWorker = ++this.currentWorker >= this.cluster.length ? 0 : this.currentWorker)].postJob(request);
        }).bind(this);
        this.postJobAll = (async (request) => {
            return Promise.all(this.cluster.map((managedWorker) => managedWorker.postJob(request)));
        }).bind(this);
        const clusterSize = config?.clusterSize ?? DEFAULT_CONFIG.clusterSize;
        if (!clusterSize || clusterSize <= 0) {
            throw new EnclaveKmsError('Invalid cluster size.');
        }
        this.cluster = Array.from({ length: clusterSize }, () => new ManagedWorker(workerConstructor()));
        if (config?.asymmetric)
            this.asymmetric = new config.asymmetric(this.postJobSingle, this.postJobAll);
        if (config?.hybrid)
            this.hybrid = new config.hybrid(this.postJobSingle, this.postJobAll);
        if (config?.keys)
            this.keys = new config.keys(this.postJobSingle, this.postJobAll);
        if (config?.session)
            this.session = new config.session(this.postJobSingle, this.postJobAll);
        if (config?.symmetric)
            this.symmetric = new config.symmetric(this.postJobSingle, this.postJobAll);
    }
}
