import type { Action } from './action';
import type { PayloadBase } from '../interfaces/payload-base';
import type { RequestPayload } from './request-payload';
import type { JobMetadata } from '../interfaces/job-metadata';
/** Used internally for communication to workers. */
export type Job<A extends Action> = PayloadBase<A, unknown> & RequestPayload & JobMetadata;
