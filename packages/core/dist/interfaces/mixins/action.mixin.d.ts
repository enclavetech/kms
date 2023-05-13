import type { Action } from '../../types';
export interface ActionMixin<T extends Action> {
    action: T;
}
