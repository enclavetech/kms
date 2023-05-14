import { EnclaveKmsError } from '../../shared/errors/enclave-kms.error';
export declare class AdapterError extends EnclaveKmsError {
    readonly fnName: string;
    constructor(fnName: string);
}
