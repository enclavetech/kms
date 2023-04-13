import type { KeyManagerResult } from './result';
export interface KeyManagerErrorResult extends KeyManagerResult {
    error: string;
    ok: false;
}
