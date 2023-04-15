import { DEFAULT_CONFIG } from '../../constants';
import { Manager } from './manager';
import { KeyWorker } from './worker';
export class KeyWorkerCluster extends Manager {
    constructor(config = DEFAULT_CONFIG) {
        var _a;
        super();
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
    decrypt(data, privateKeyID) {
        return this.getNextWorker().decrypt(privateKeyID, data);
    }
    encrypt(data, privateKeyID) {
        return this.getNextWorker().encrypt(privateKeyID, data);
    }
    async importKey(privateKey, privateKeyID) {
        if (!privateKeyID)
            privateKeyID = this.getNextID();
        return Promise.all(this.cluster.map((worker) => worker.importKey(privateKey, privateKeyID))).then((results) => results[0]);
    }
}
