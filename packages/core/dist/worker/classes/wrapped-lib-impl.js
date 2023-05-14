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
            throw new AdapterError(fnName);
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
    encryptSessionKey(sessionKey, privateKey) {
        return this.wrap(() => this.libImpl.encryptSessionKey(sessionKey, privateKey), this.encryptSessionKey.name);
    }
    encryptWithPrivateKey(payload, key) {
        return this.wrap(() => this.libImpl.encryptWithPrivateKey(payload, key), this.encryptWithPrivateKey.name);
    }
    encryptWithSessionKey(payload, key) {
        return this.wrap(() => this.libImpl.encryptWithSessionKey(payload, key), this.encryptWithSessionKey.name);
    }
    generatePrivateKey() {
        return this.wrap(() => this.libImpl.generatePrivateKey(), this.generatePrivateKey.name);
    }
    generateSessionKey(privateKey) {
        return this.wrap(() => this.libImpl.generateSessionKey(privateKey), this.generateSessionKey.name);
    }
    parsePrivateKey(key) {
        return this.wrap(() => this.libImpl.parsePrivateKey(key), this.parsePrivateKey.name);
    }
    stringifyPrivateKey(key) {
        return this.wrap(() => this.libImpl.stringifyPrivateKey(key), this.stringifyPrivateKey.name);
    }
}
