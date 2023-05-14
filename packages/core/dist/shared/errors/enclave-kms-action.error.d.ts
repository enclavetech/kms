import type { Action } from '../types/action';
import { EnclaveKmsError } from './enclave-kms.error';
export declare class EnclaveKmsActionError<T extends Action> extends EnclaveKmsError {
    readonly action: T;
    constructor(action: T, errorMessage: string);
}
