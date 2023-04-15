import type { KeyManagerSuccessResult } from './success';
import type { KeyManagerSuccessDataResult } from './success-data';

export * from './result';
export * from './error';
export * from './success';
export * from './success-data';

export type KeyManagerDecryptResult = KeyManagerSuccessDataResult;
export type KeyManagerEncryptResult = KeyManagerSuccessDataResult;
export type KeyManagerImportKeyResult = KeyManagerSuccessResult;
