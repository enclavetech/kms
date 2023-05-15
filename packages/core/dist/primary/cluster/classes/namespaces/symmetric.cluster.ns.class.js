export class ClusterSymmetricNS {
    constructor(getNextWorker) {
        this.getNextWorker = getNextWorker;
    }
    decrypt(request) {
        return this.getNextWorker().symmetric.decrypt(request);
    }
    encrypt(request) {
        return this.getNextWorker().symmetric.encrypt(request);
    }
}
