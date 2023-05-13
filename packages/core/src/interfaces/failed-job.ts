import type { Action } from '../types/action';
import type { JobMetadata } from './job-metadata';

export interface FailedJob<A extends Action> extends JobMetadata {
  action: A;
  error: string;
  ok: false;
}
