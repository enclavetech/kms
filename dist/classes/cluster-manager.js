import { WorkerManager } from './worker-manager';
// TODO: make an abstract API for this and `WorkerManager`
export class ClusterManager {
    constructor(clusterCount = 1) {
        this.cluster = new Array();
        this.currentWorker = 0;
        if (clusterCount <= 0) {
            throw 'Invalid cluster count';
        }
        for (let i = 0; i < clusterCount; i++) {
            this.cluster.push(new WorkerManager());
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
