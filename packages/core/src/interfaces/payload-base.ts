import type { Action } from '../types/action';

export interface PayloadBase<A extends Action, T = void> {
  action: A;
  payload: T;
}
