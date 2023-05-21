import { AdapterError } from '../errors/adapter-error';
export class WrappedAdapter {
    constructor(adapter) {
        this.adapter = adapter;
    }
    // TODO: move to worker, this class is probably unnecessary
    /** Ensures a promise is always the return value and handles errors. */
    async wrap(fn, fnName) {
        try {
            return await fn();
        }
        catch (e) {
            throw new AdapterError(this.adapter.constructor.name, fnName);
        }
    }
    decryptPrivateKey(privateKey, secret) {
        return this.wrap(() => this.adapter.decryptPrivateKey(privateKey, secret), this.decryptPrivateKey.name);
    }
    decryptSessionKey(sessionKey, privateKey) {
        return this.wrap(() => this.adapter.decryptSessionKey(sessionKey, privateKey), this.decryptSessionKey.name);
    }
    decryptWithPrivateKey(payload, key) {
        return this.wrap(() => this.adapter.decryptWithPrivateKey(payload, key), this.decryptWithPrivateKey.name);
    }
    decryptWithSessionKey(payload, key) {
        return this.wrap(() => this.adapter.decryptWithSessionKey(payload, key), this.decryptWithSessionKey.name);
    }
    encryptPrivateKey(privateKey, secret) {
        return this.wrap(() => this.adapter.encryptPrivateKey(privateKey, secret), this.encryptPrivateKey.name);
    }
    encryptSessionKey(sessionKey, publicKey) {
        return this.wrap(() => this.adapter.encryptSessionKey(sessionKey, publicKey), this.encryptSessionKey.name);
    }
    /** @deprecated */
    encryptWithPrivateKey(payload, key) {
        return this.wrap(() => this.adapter.encryptWithPrivateKey(payload, key), this.encryptWithPrivateKey.name);
    }
    encryptWithPublicKey(payload, key) {
        return this.wrap(() => this.adapter.encryptWithPublicKey(payload, key), this.encryptWithPublicKey.name);
    }
    encryptWithSessionKey(payload, key) {
        return this.wrap(() => this.adapter.encryptWithSessionKey(payload, key), this.encryptWithSessionKey.name);
    }
    generateKeyPair() {
        return this.wrap(() => this.adapter.generateKeyPair(), this.generateKeyPair.name);
    }
    generatePrivateKey() {
        return this.wrap(() => this.adapter.generatePrivateKey(), this.generatePrivateKey.name);
    }
    generateSessionKey(publicKey) {
        return this.wrap(() => this.adapter.generateSessionKey(publicKey), this.generateSessionKey.name);
    }
    parsePrivateKey(key) {
        return this.wrap(() => this.adapter.parsePrivateKey(key), this.parsePrivateKey.name);
    }
    parsePublicKey(key) {
        return this.wrap(() => this.adapter.parsePublicKey(key), this.parsePublicKey.name);
    }
    stringifyPrivateKey(key) {
        return this.wrap(() => this.adapter.stringifyPrivateKey(key), this.stringifyPrivateKey.name);
    }
    stringifyPublicKey(key) {
        return this.wrap(() => this.adapter.stringifyPublicKey(key), this.stringifyPublicKey.name);
    }
    symmetricDecrypt(payload, passphrase) {
        return this.wrap(() => this.adapter.symmetricDecrypt(payload, passphrase), this.symmetricDecrypt.name);
    }
    symmetricEncrypt(payload, passphrase) {
        return this.wrap(() => this.adapter.symmetricEncrypt(payload, passphrase), this.symmetricEncrypt.name);
    }
}
