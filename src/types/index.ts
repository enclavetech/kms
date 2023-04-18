import { KeyManagerResult } from '../interfaces/results';

export type PrivateKeyID = string;
export type WorkerJobID = number;

export type KeyManagerAction = 'importKey' | 'decrypt' | 'encrypt';

export type KeyManagerCallback<Action extends KeyManagerAction> = (result: KeyManagerResult<Action>) => void;
