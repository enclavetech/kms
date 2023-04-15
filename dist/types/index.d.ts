import { KeyManagerResult } from '../interfaces/results';
export type PrivateKeyID = string;
export type WorkerJobID = number;
export type KeyManagerAction = 'decrypt' | 'encrypt' | 'importKey';
export type KeyManagerCallback = (result: KeyManagerResult) => void;
