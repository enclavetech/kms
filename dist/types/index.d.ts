import { KeyManagerResult } from '../interfaces/results';
/**
 * @TODO user should be able to specify their own type to use as ID
 */
export type PrivateKeyID = string;
export type PrivateKey = string;
export type WorkerJobID = number;
export type KeyManagerAction = 'decrypt' | 'encrypt' | 'put';
export type KeyManagerCallback = (result: KeyManagerResult) => void;
