export class ClusterSessionNS {
    constructor(getNextWorker, doForAll) {
        this.getNextWorker = getNextWorker;
        this.doForAll = doForAll;
    }
    destroy() {
        return this.doForAll((worker) => worker.session.destroy());
    }
    export() {
        return this.getNextWorker().session.export();
    }
    async import(request) {
        const importSessionResult = await this.doForAll((worker) => worker.session.import({ ...request, reexport: false }));
        return (request.reexport
            ? {
                ...importSessionResult,
                ...(await this.export()),
                reexported: true,
            }
            : importSessionResult);
    }
}
