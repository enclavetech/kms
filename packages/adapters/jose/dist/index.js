import { compactDecrypt, CompactEncrypt, exportJWK, generateKeyPair, importJWK, } from 'jose';
// TODO: review algorithms
// eventually they'll be configurable, but we'll have sensible defaults
// may need extra logic to determine alg of imported keys, etc.
const KEY_ALG = 'ES512';
export class Adapter {
    constructor() {
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
        this.decryptWithPrivateKey = this.decrypt;
        this.decryptWithSessionKey = this.decrypt;
        this.encryptWithPrivateKey = this.asymmetricEncrypt;
        this.encryptWithPublicKey = this.asymmetricEncrypt;
        this.parsePrivateKey = this.parseKey;
        this.parsePublicKey = this.parseKey;
        this.stringifyPrivateKey = this.stringifyKey;
        this.stringifyPublicKey = this.stringifyKey;
    }
    async asymmetricEncrypt(payload, key) {
        return this.encrypt(payload, key, {
            alg: 'ECDH-ES+A256KW',
            enc: 'A256CBC-HS512',
        });
    }
    async decrypt(payload, key) {
        return this.decoder.decode((await compactDecrypt(payload, key)).plaintext);
    }
    async decryptPrivateKey(privateKey, secret) {
        return await this.parsePrivateKey(await this.symmetricDecrypt(privateKey, secret));
    }
    async decryptSessionKey(sessionKey, privateKey) {
        return this.parseKey(await this.decrypt(sessionKey, privateKey));
    }
    async encrypt(payload, key, protectedHeader) {
        return new CompactEncrypt(this.encoder.encode(payload)).setProtectedHeader(protectedHeader).encrypt(key);
    }
    async encryptPrivateKey(privateKey, secret) {
        return await this.symmetricEncrypt(await this.stringifyPrivateKey(privateKey), secret);
    }
    async encryptSessionKey(sessionKey, publicKey) {
        return this.asymmetricEncrypt(await this.stringifyKey(sessionKey), publicKey);
    }
    encryptWithSessionKey(payload, key) {
        return this.encrypt(payload, key, {
            alg: 'PBES2-HS512+A256KW',
            enc: 'A256CBC-HS512',
        });
    }
    generateKeyPair() {
        return generateKeyPair(KEY_ALG, { extractable: true });
    }
    async generatePrivateKey() {
        return (await this.generateKeyPair()).privateKey;
    }
    generateSessionKey(publicKey) {
        throw 'Method not implemented'; // TODO
    }
    async parseKey(key) {
        const parsed = await importJWK({ ...JSON.parse(key), ext: true }, KEY_ALG);
        if (parsed instanceof Uint8Array)
            throw 'Unexpected key format';
        return parsed;
    }
    async stringifyKey(key) {
        return JSON.stringify(await exportJWK(key));
    }
    symmetricDecrypt(payload, passphrase) {
        return this.decrypt(payload, this.encoder.encode(passphrase));
    }
    symmetricEncrypt(payload, password) {
        return this.encrypt(payload, this.encoder.encode(password), {
            alg: 'PBES2-HS512+A256KW',
            enc: 'A256CBC-HS512',
        });
    }
}
export default Adapter;
