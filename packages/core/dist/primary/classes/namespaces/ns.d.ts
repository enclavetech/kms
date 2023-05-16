import type { Action, Request, Result } from '../../../shared/types';
export declare abstract class NS {
    protected readonly postJobSingle: <T extends Action>(request: Request<T>) => Promise<Result<T>>;
    protected readonly postJobAll: <T extends Action>(request: Request<T>) => Promise<Result<T>[]>;
    constructor(postJobSingle: <T extends Action>(request: Request<T>) => Promise<Result<T>>, postJobAll: <T extends Action>(request: Request<T>) => Promise<Result<T>[]>);
}
