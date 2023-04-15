import { DEFAULT_CONFIG } from '../../constants';
import { KeyWorker } from './worker';
export class KeyWorkerCluster {
    constructor(config = DEFAULT_CONFIG) {
        var _a;
        this.cluster = new Array();
        this.currentWorker = 0;
        const clusterSize = (_a = config.clusterSize) !== null && _a !== void 0 ? _a : DEFAULT_CONFIG.clusterSize;
        if (!clusterSize || clusterSize <= 0) {
            throw 'Invalid cluster size';
        }
        for (let i = 0; i < clusterSize; i++) {
            this.cluster.push(new KeyWorker());
        }
    }
    getNextWorker() {
        return this.cluster[(this.currentWorker = ++this.currentWorker >= this.cluster.length ? 0 : this.currentWorker)];
    }
    decrypt(privateKeyID, data) {
        return this.getNextWorker().decrypt(privateKeyID, data);
    }
    encrypt(privateKeyID, data) {
        return this.getNextWorker().encrypt(privateKeyID, data);
    }
    async put(privateKeyID, armoredKey) {
        return Promise.all(this.cluster.map((worker) => worker.put(privateKeyID, armoredKey))).then((results) => results[0]);
    }
}
