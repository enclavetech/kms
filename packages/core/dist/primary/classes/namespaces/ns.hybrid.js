import { NS } from './ns';
export class HybridNS extends NS {
    async decrypt(payload) {
        return (await this.postJobSingle({ action: 'hybridDecrypt', payload })).payload;
    }
    async encrypt(payload) {
        return (await this.postJobSingle({ action: 'hybridEncrypt', payload })).payload;
    }
    async shareKey(payload) {
        return (await this.postJobSingle({ action: 'reencryptSessionKey', payload })).payload;
    }
}
