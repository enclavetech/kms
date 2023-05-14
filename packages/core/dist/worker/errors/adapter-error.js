import { EnclaveKmsError } from '../../shared/errors/enclave-kms.error';
export class AdapterError extends EnclaveKmsError {
    constructor(fnName) {
        super(`(adapter) ${fnName} failed`);
        this.fnName = fnName;
    }
}
