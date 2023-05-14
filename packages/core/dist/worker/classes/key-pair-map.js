import { EnclaveKmsActionError } from '../../shared/errors/enclave-kms-action.error';
export class KeyPairMap {
    constructor() {
        this.keyPairMap = {};
    }
    *[Symbol.iterator]() {
        const entries = Object.entries(this.keyPairMap);
        let counter = 0;
        while (counter < entries.length) {
            yield entries[counter++];
        }
    }
    clear() {
        this.keyPairMap = {};
    }
    get(id, job) {
        const keyPair = this.keyPairMap[id];
        if (!keyPair) {
            throw new EnclaveKmsActionError(job.action, `Key pair with ID ${id} not found`);
        }
        return keyPair;
    }
    getPrivateKey(id, job) {
        const { privateKey } = this.get(id, job);
        if (!privateKey) {
            throw new EnclaveKmsActionError(job.action, `We do not have the private key for key pair ID ${id}`);
        }
        return privateKey;
    }
    getPublicKey(id, job) {
        return this.get(id, job).publicKey;
    }
    set(id, keyPair) {
        this.keyPairMap[id] = keyPair;
    }
}
