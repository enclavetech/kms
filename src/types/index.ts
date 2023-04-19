import { KeyManagerResult } from '../interfaces/results';

export type PrivateKeyID = string;
export type WorkerJobID = number;

export type KeyManagerAction =
  | 'importKey'
  | 'destroySession'
  | 'exportSession'
  | 'importSession'
  | 'decrypt'
  | 'encrypt';

export type KeyManagerCallback<Action extends KeyManagerAction> = (result: KeyManagerResult<Action>) => void;
