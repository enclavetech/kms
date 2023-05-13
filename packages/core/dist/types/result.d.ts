import type { Action } from './action';
import type { PayloadBase } from '../interfaces/payload-base';
import type { ResultPayload } from './result-payload';
/** Used internally for communication from workers. */
export type Result<A extends Action> = PayloadBase<A, unknown> & ResultPayload & {
    error?: string;
    ok: boolean;
};
