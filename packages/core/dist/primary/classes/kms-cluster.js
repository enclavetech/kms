import { DEFAULT_CONFIG } from '../constants/default-config';
import { KmsWorkerCore } from './kms-worker';
// TODO: return results for all workers rather than just one
export class KmsClusterCore {
    constructor(config = DEFAULT_CONFIG) {
        this.cluster = new Array();
        this.currentWorker = 0;
        const clusterSize = config.clusterSize ?? DEFAULT_CONFIG.clusterSize;
        if (!clusterSize || clusterSize <= 0) {
            throw 'Enclave KMS: Invalid clusterSize.';
        }
        for (let i = 0; i < clusterSize; i++) {
            this.cluster.push(this.createWorker());
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
    async importKeys(...request) {
        return (await Promise.all(this.cluster.map((worker) => worker.importKeys(...request))))[0];
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
