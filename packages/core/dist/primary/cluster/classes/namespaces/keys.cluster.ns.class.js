export class ClusterKeysNS {
    constructor(doForAll) {
        this.doForAll = doForAll;
    }
    async import(...request) {
        return this.doForAll((worker) => worker.keys.import(...request));
    }
}
