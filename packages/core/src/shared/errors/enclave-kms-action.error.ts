import type { Action } from '../types/action';
import { EnclaveKmsError } from './enclave-kms.error';

export class EnclaveKmsActionError<T extends Action> extends EnclaveKmsError {
  constructor(readonly action: T, errorMessage: string) {
    super(`${action} failed: ${errorMessage}`);
  }
}
