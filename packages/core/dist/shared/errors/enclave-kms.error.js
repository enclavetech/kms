export class EnclaveKmsError extends Error {
    constructor(errorMessage) {
        super(`Enclave KMS: ${errorMessage}`);
    }
}
