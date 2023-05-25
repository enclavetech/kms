import { EnclaveKmsError } from '../../shared/errors/enclave-kms.error';
export class AdapterError extends EnclaveKmsError {
    constructor(adapterName, fnName, message) {
        super(`${adapterName}: ${fnName} failed: ${message}.`);
        this.adapterName = adapterName;
        this.fnName = fnName;
    }
}
