import type { Action, CompletedJob } from '../../../shared/types';
import type { IKMS } from '../../shared/interfaces/kms.interface';
import { WorkerAsymmetricNS, WorkerHybridNS, WorkerKeysNS, WorkerSessionNS, WorkerSymmetricNS } from './namespaces';
export declare abstract class KmsWorkerCore implements IKMS {
    protected abstract readonly worker: Worker;
    private readonly pendingJobs;
    private jobCounter;
    private readonly postJob;
    readonly asymmetric: WorkerAsymmetricNS;
    readonly hybrid: WorkerHybridNS;
    readonly keys: WorkerKeysNS;
    readonly session: WorkerSessionNS;
    readonly symmetric: WorkerSymmetricNS;
    protected handleCompletedJob(event: MessageEvent<CompletedJob<Action>>): void;
}
