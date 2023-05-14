import { EnclaveKmsError } from '../../shared/errors/enclave-kms.error';
export declare class AdapterError extends EnclaveKmsError {
    readonly adapterName: string;
    readonly fnName: string;
    constructor(adapterName: string, fnName: string);
}
