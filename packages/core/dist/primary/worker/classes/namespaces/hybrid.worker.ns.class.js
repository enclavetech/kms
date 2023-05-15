export class WorkerHybridNS {
    constructor(postJob) {
        this.postJob = postJob;
    }
    async decrypt(payload) {
        return (await this.postJob({ action: 'hybridDecrypt', payload })).payload;
    }
    async encrypt(payload) {
        return (await this.postJob({ action: 'hybridEncrypt', payload })).payload;
    }
    async shareKey(payload) {
        return (await this.postJob({ action: 'reencryptSessionKey', payload })).payload;
    }
}
