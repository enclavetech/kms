export class WorkerSymmetricNS {
    constructor(postJob) {
        this.postJob = postJob;
    }
    async decrypt(payload) {
        return (await this.postJob({ action: 'symmetricDecrypt', payload })).payload;
    }
    async encrypt(payload) {
        return (await this.postJob({ action: 'symmetricEncrypt', payload })).payload;
    }
}
