import type { KmsAction } from './action';
import type { KmsResult } from './result';

export type KmsCallback<A extends KmsAction, T = void> = (result: KmsResult<A, T>) => void;
