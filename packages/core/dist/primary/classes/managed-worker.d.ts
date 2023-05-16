import type { Action, Request, Result } from '../../shared/types';
export declare class ManagedWorker {
    private readonly worker;
    constructor(worker: Worker);
    private pendingJobs;
    private jobCounter;
    postJob<A extends Action>(payload: Request<A>): Promise<Result<A>>;
}
