import { EnclaveKmsError } from './enclave-kms.error';
export class EnclaveKmsActionError extends EnclaveKmsError {
    constructor(action, errorMessage) {
        super(`${action} failed: ${errorMessage}`);
        this.action = action;
    }
}
