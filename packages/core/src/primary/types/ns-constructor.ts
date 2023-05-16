import type { Action, Request, Result } from '../../shared/types';
import type { NS } from '../classes/namespaces/ns';

export type NSConstructor<T extends NS> = new (
  postJobSingle: <T extends Action>(request: Request<T>) => Promise<Result<T>>,
  postJobAll: <T extends Action>(request: Request<T>) => Promise<Result<T>[]>,
) => T;
