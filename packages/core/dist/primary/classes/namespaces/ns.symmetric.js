import { NS } from './ns';
export class SymmetricNS extends NS {
    async decrypt(payload) {
        return (await this.postJobSingle({ action: 'symmetricDecrypt', payload })).payload;
    }
    async encrypt(payload) {
        return (await this.postJobSingle({ action: 'symmetricEncrypt', payload })).payload;
    }
}
