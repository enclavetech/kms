export class ClusterHybridNS {
    constructor(getNextWorker) {
        this.getNextWorker = getNextWorker;
    }
    decrypt(request) {
        return this.getNextWorker().hybrid.decrypt(request);
    }
    encrypt(request) {
        return this.getNextWorker().hybrid.encrypt(request);
    }
    shareKey(request) {
        return this.getNextWorker().hybrid.shareKey(request);
    }
}
