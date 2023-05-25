import { EnclaveKmsError } from '../../shared/errors/enclave-kms.error';

export class AdapterError extends EnclaveKmsError {
  constructor(readonly adapterName: string, readonly fnName: string, message?: string) {
    super(`${adapterName}: ${fnName} failed: ${message}.`);
  }
}
