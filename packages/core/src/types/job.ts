import type { Action } from './action';
import type { PayloadBase } from '../interfaces/payload-base';

/** Used internally for communication to workers. */
export type Job<A extends Action, T = void> = PayloadBase<A, T> & {
  jobID: number;
};
