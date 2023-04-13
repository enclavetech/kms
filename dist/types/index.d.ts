import { KeyManagerResult } from '../interfaces/results';
export type PrivateKeyID = string;
export type PrivateKey = string;
export type WorkerJobID = number;
export type KeyManagerAction = 'decrypt' | 'encrypt' | 'put';
export type KeyManagerCallback = (result: KeyManagerResult) => void;
