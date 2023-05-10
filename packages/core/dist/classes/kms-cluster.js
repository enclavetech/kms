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
    async importKey(keyImportRequest) {
        return (await Promise.all(this.cluster.map((worker) => worker.importKey(keyImportRequest))))[0];
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
    decrypt(decryptRequest) {
        return this.getNextWorker().decrypt(decryptRequest);
    }
    encrypt(encryptRequest) {
        return this.getNextWorker().encrypt(encryptRequest);
    }
    hybridDecrypt(hybridDecryptRequest) {
        return this.getNextWorker().hybridDecrypt(hybridDecryptRequest);
    }
    hybridEncrypt(hybridEncryptRequest) {
        return this.getNextWorker().hybridEncrypt(hybridEncryptRequest);
    }
}
