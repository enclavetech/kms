import { KMS as KmsCore } from '@enclavetech/kms-core';
export class KMS extends KmsCore {
    constructor(config) {
        super(() => new Worker(new URL('../workers/worker.js?worker', import.meta.url), {
            type: 'module',
        }), config);
    }
}
