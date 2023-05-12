import type { Action } from './action';
import type { Job } from './job';
import type { Result } from './result';

/** Used internally for communication from workers. */
export type CompletedJob<A extends Action, T = void> = Job<A, T> & Result<A, T>;
