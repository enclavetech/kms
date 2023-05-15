export class WorkerAsymmetricNS {
    constructor(postJob) {
        this.postJob = postJob;
    }
    async decrypt(payload) {
        return (await this.postJob({ action: 'asymmetricDecrypt', payload })).payload;
    }
    async encrypt(payload) {
        return (await this.postJob({ action: 'asymmetricEncrypt', payload })).payload;
    }
}
