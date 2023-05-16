import type { Action, Request, Result } from '../../../shared/types';

export abstract class NS {
  constructor(
    protected readonly postJobSingle: <T extends Action>(request: Request<T>) => Promise<Result<T>>,
    protected readonly postJobAll: <T extends Action>(request: Request<T>) => Promise<Result<T>[]>,
  ) {}
}
