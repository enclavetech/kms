import { DEFAULT_CONFIG } from '../constants/default-config';
import { KMS } from './kms';
import { KmsWorkerCore } from './kms-worker';
export class KmsClusterCore extends KMS {
    constructor(config = DEFAULT_CONFIG) {
        super();
        this.config = config;
        this.cluster = new Array();
        this.currentWorker = 0;
        const clusterSize = config.clusterSize ?? DEFAULT_CONFIG.clusterSize;
        if (!clusterSize || clusterSize <= 0) {
            throw 'Enclave KMS: Invalid clusterSize.';
        }
        for (let i = 0; i < clusterSize; i++) {
            this.cluster.push(this.createWorker(config));
        }
    }
    getNextWorker() {
        return this.cluster[(this.currentWorker = ++this.currentWorker >= this.cluster.length ? 0 : this.currentWorker)];
    }
    async importKey(payload) {
        return (await Promise.all(this.cluster.map((worker) => worker.importKey(payload))))[0];
    }
    async destroySession() {
        return (await Promise.all(this.cluster.map((worker) => worker.destroySession())))[0];
    }
    exportSession() {
        return this.getNextWorker().exportSession();
    }
    async importSession(payload) {
        return (await Promise.all(this.cluster.map((worker) => worker.importSession(payload))))[0];
    }
    async importExportSession(payload) {
        const nextWorker = this.getNextWorker();
        const importResultPromise = nextWorker.importExportSession(payload);
        console.log(await Promise.all(this.cluster.map((worker) => worker === nextWorker ? importResultPromise : worker.importSession(payload))));
        return await importResultPromise;
    }
    decrypt(payload) {
        return this.getNextWorker().decrypt(payload);
    }
    encrypt(payload) {
        return this.getNextWorker().encrypt(payload);
    }
    hybridDecrypt(payload) {
        return this.getNextWorker().hybridDecrypt(payload);
    }
    hybridEncrypt(payload) {
        return this.getNextWorker().hybridEncrypt(payload);
    }
}
