import type { KeyManagerAction } from '../../types';
export interface WorkerResponse {
    action: KeyManagerAction;
    jobID: number;
    ok: boolean;
}
