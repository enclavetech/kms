export class WorkerKeysNS {
    constructor(postJob) {
        this.postJob = postJob;
    }
    import(...payloads) {
        return Promise.all(payloads.map(async (payload) => (await this.postJob({ action: 'importKeyPair', payload })).payload));
    }
}
