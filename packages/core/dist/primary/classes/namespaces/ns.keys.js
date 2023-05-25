import { NS } from './ns';
export class KeysNS extends NS {
    async encryptPrivateKey(payload) {
        return (await this.postJobSingle({ action: 'encryptPrivateKey', payload })).payload;
    }
    async generateKeyPair(payload) {
        return (await this.postJobSingle({ action: 'generateKeyPair', payload })).payload;
    }
    import(...requests) {
        // TODO: if failed for some workers only,
        // send `forgetKey` job to roll operation back and throw error
        // this is a problem as they would be out of sync
        // if failed for ALL workers, just raise a warning about the key being unavailable
        return Promise.all(requests.map(async (payload) => (await this.postJobAll({ action: 'importKeyPair', payload }))[0].payload));
    }
}
