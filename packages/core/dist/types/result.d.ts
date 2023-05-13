import type { Action } from './action';
import type { ResultPayload } from './result-payload';
import type { ActionMixin } from '../interfaces/mixins/action.mixin';
/** Used internally for communication from workers. */
export type Result<A extends Action> = ActionMixin<A> & ResultPayload & {
    error?: string;
    ok: boolean;
};
