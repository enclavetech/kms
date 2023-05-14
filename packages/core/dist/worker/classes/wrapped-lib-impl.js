import { AdapterError } from '../errors/adapter-error';
export class WrappedLibImpl {
    constructor(libImpl) {
        this.libImpl = libImpl;
    }
    /** Ensures a promise is always the return value and handles errors. */
    async wrap(fn, fnName) {
        try {
            return await fn();
        }
        catch (e) {
            throw new AdapterError(this.libImpl.constructor.name, fnName);
        }
    }
    decryptSessionKey(sessionKey, privateKey) {
        return this.wrap(() => this.libImpl.decryptSessionKey(sessionKey, privateKey), this.decryptSessionKey.name);
    }
    decryptWithPrivateKey(payload, key) {
        return this.wrap(() => this.libImpl.decryptWithPrivateKey(payload, key), this.decryptWithPrivateKey.name);
    }
    decryptWithSessionKey(payload, key) {
        return this.wrap(() => this.libImpl.decryptWithSessionKey(payload, key), this.decryptWithSessionKey.name);
    }
    encryptSessionKey(sessionKey, publicKey) {
        return this.wrap(() => this.libImpl.encryptSessionKey(sessionKey, publicKey), this.encryptSessionKey.name);
    }
    /** @deprecated */
    encryptWithPrivateKey(payload, key) {
        return this.wrap(() => this.libImpl.encryptWithPrivateKey(payload, key), this.encryptWithPrivateKey.name);
    }
    encryptWithPublicKey(payload, key) {
        return this.wrap(() => this.libImpl.encryptWithPublicKey(payload, key), this.encryptWithPublicKey.name);
    }
    encryptWithSessionKey(payload, key) {
        return this.wrap(() => this.libImpl.encryptWithSessionKey(payload, key), this.encryptWithSessionKey.name);
    }
    generatePrivateKey() {
        return this.wrap(() => this.libImpl.generatePrivateKey(), this.generatePrivateKey.name);
    }
    generateSessionKey(publicKey) {
        return this.wrap(() => this.libImpl.generateSessionKey(publicKey), this.generateSessionKey.name);
    }
    parsePrivateKey(key) {
        return this.wrap(() => this.libImpl.parsePrivateKey(key), this.parsePrivateKey.name);
    }
    parsePublicKey(key) {
        return this.wrap(() => this.libImpl.parsePublicKey(key), this.parsePublicKey.name);
    }
    stringifyPrivateKey(key) {
        return this.wrap(() => this.libImpl.stringifyPrivateKey(key), this.stringifyPrivateKey.name);
    }
    stringifyPublicKey(key) {
        return this.wrap(() => this.libImpl.stringifyPublicKey(key), this.stringifyPublicKey.name);
    }
    symmetricDecrypt(payload, passphrase) {
        return this.wrap(() => this.libImpl.symmetricDecrypt(payload, passphrase), this.symmetricDecrypt.name);
    }
    symmetricEncrypt(payload, passphrase) {
        return this.wrap(() => this.libImpl.symmetricEncrypt(payload, passphrase), this.symmetricEncrypt.name);
    }
}
