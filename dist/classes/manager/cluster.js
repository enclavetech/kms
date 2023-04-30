import { DEFAULT_CONFIG } from '../../constants';
import { KeyManager } from './manager';
import { KeyWorkerManager } from './worker';
export class KeyWorkerClusterManager extends KeyManager {
    constructor(config = DEFAULT_CONFIG) {
        var _a;
        super();
        this.config = config;
        this.cluster = new Array();
        this.currentWorker = 0;
        const clusterSize = (_a = this.config.clusterSize) !== null && _a !== void 0 ? _a : DEFAULT_CONFIG.clusterSize;
        if (!clusterSize || clusterSize <= 0) {
            throw 'Invalid cluster size';
        }
        for (let i = 0; i < clusterSize; i++) {
            this.cluster.push(new KeyWorkerManager());
        }
    }
    getNextWorker() {
        return this.cluster[(this.currentWorker = ++this.currentWorker >= this.cluster.length ? 0 : this.currentWorker)];
    }
    async importKey(armoredKey, keyID = this.getNextID()) {
        return (await Promise.all(this.cluster.map((worker) => worker.importKey(armoredKey, keyID))))[0];
    }
    async destroySession() {
        return (await Promise.all(this.cluster.map((worker) => worker.destroySession())))[0];
    }
    exportSession() {
        return this.getNextWorker().exportSession();
    }
    async importSession(sessionPayload) {
        return (await Promise.all(this.cluster.map((worker) => worker.importSession(sessionPayload))))[0];
    }
    decrypt(privateKeyID, data) {
        return this.getNextWorker().decrypt(privateKeyID, data);
    }
    encrypt(privateKeyID, data) {
        return this.getNextWorker().encrypt(privateKeyID, data);
    }
    hybridDecrypt(message, messageKey, privateKeyID) {
        return this.getNextWorker().hybridDecrypt(message, messageKey, privateKeyID);
    }
    hybridEncrypt(data, privateKeyID) {
        return this.getNextWorker().hybridEncrypt(privateKeyID, data);
    }
}
