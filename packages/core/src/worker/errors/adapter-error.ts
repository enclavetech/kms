import { EnclaveKmsError } from '../../shared/errors/enclave-kms.error';

export class AdapterError extends EnclaveKmsError {
  constructor(readonly fnName: string) {
    super(`(adapter) ${fnName} failed`);
  }
}
