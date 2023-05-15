export class WorkerSessionNS {
    constructor(postJob) {
        this.postJob = postJob;
    }
    async destroy() {
        await this.postJob({ action: 'destroySession' });
    }
    async export() {
        return (await this.postJob({ action: 'exportSession' })).payload;
    }
    async import(payload) {
        const importResult = (await this.postJob({ action: 'importSession', payload })).payload;
        return (payload.reexport
            ? {
                ...importResult,
                ...(await this.export()),
                reexported: true,
            }
            : importResult);
    }
}
