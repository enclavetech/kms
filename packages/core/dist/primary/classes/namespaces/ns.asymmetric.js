import { NS } from './ns';
export class AsymmetricNS extends NS {
    async decrypt(payload) {
        return (await this.postJobSingle({ action: 'asymmetricDecrypt', payload })).payload;
    }
    async encrypt(payload) {
        return (await this.postJobSingle({ action: 'asymmetricEncrypt', payload })).payload;
    }
}
