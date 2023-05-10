import type { KmsConfig } from '../interfaces/configs/kms-config';
/**
 * Default KMS config values.
 * `workerURL` is omitted. The URL must be provided by the library implementation.
 */
export declare const DEFAULT_CONFIG: Omit<KmsConfig, 'workerURL'>;
