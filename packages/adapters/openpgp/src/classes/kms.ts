import { KMS as KmsCore, type KmsConfig } from '@enclavetech/kms-core';

export class KMS extends KmsCore {
  constructor(config?: KmsConfig) {
    super(
      () =>
        new Worker(new URL('../workers/worker.js?worker', import.meta.url), {
          type: 'module',
        }),
      config,
    );
  }
}
