import { EnclaveKmsError } from '../../shared/errors/enclave-kms.error';
export class AdapterError extends EnclaveKmsError {
    constructor(adapterName, fnName) {
        super(`${adapterName}: ${fnName} failed`);
        this.adapterName = adapterName;
        this.fnName = fnName;
    }
}
