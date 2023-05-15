export class ClusterAsymmetricNS {
    constructor(getNextWorker) {
        this.getNextWorker = getNextWorker;
    }
    decrypt(request) {
        return this.getNextWorker().asymmetric.decrypt(request);
    }
    encrypt(request) {
        return this.getNextWorker().asymmetric.encrypt(request);
    }
}
