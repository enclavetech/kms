import type { JobMetadata } from '../interfaces/job-metadata';
import type { Action } from './action';
import type { Result } from './result';
/** Used internally for communication from workers. */
export type CompletedJob<A extends Action> = Result<A> & JobMetadata;
