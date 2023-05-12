import type { Action } from './action';
import type { PayloadBase } from '../interfaces/payload-base';
/** Used internally for communication from workers. */
export type Result<A extends Action, T = void> = PayloadBase<A, T> & {
    error?: string;
    ok: boolean;
};
