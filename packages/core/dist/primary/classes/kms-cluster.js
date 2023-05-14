import { DEFAULT_CONFIG } from '../constants/default-config';
import { KMS } from './kms';
import { KmsWorkerCore } from './kms-worker';
// TODO: return result for all workers rather than just one
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
    asymmetricDecrypt(request) {
        return this.getNextWorker().asymmetricDecrypt(request);
    }
    asymmetricEncrypt(request) {
        return this.getNextWorker().asymmetricEncrypt(request);
    }
    async destroySession() {
        return (await Promise.all(this.cluster.map((worker) => worker.destroySession())))[0];
    }
    exportSession() {
        return this.getNextWorker().exportSession();
    }
    hybridDecrypt(request) {
        return this.getNextWorker().hybridDecrypt(request);
    }
    hybridEncrypt(request) {
        return this.getNextWorker().hybridEncrypt(request);
    }
    async importPrivateKeys(...request) {
        return (await Promise.all(this.cluster.map((worker) => worker.importPrivateKeys(...request))))[0];
    }
    async importSession(request) {
        const [importSessionResult] = await Promise.all(this.cluster.map((worker) => worker.importSession({ ...request, reexport: false })));
        return (request.reexport
            ? {
                ...importSessionResult,
                ...(await this.exportSession()),
                reexported: true,
            }
            : importSessionResult);
    }
    reencryptSessionKey(request) {
        return this.getNextWorker().reencryptSessionKey(request);
    }
}
