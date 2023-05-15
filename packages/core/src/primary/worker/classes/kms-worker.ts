import type { Action, CompletedJob, FailedJob, Request, Result } from '../../../shared/types';
import type { IKMS } from '../../shared/interfaces/kms.interface';
import { WorkerAsymmetricNS, WorkerHybridNS, WorkerKeysNS, WorkerSessionNS, WorkerSymmetricNS } from './namespaces';

export abstract class KmsWorkerCore implements IKMS {
  protected abstract readonly worker: Worker;
  private readonly pendingJobs: Record<number, (result: Result<Action>) => void> = {};
  private jobCounter = 0;

  private readonly postJob = (async <A extends Action>(payload: Request<A>): Promise<Result<A>> => {
    return new Promise<Result<A>>((resolve, reject) => {
      const jobID = this.jobCounter++;
      this.pendingJobs[jobID] = function (result) {
        result.ok ? resolve(result as Result<A>) : reject(result as FailedJob<A>);
      };
      this.worker.postMessage({ jobID, ...payload });
    });
  }).bind(this);

  readonly asymmetric = new WorkerAsymmetricNS(this.postJob);
  readonly hybrid = new WorkerHybridNS(this.postJob);
  readonly keys = new WorkerKeysNS(this.postJob);
  readonly session = new WorkerSessionNS(this.postJob);
  readonly symmetric = new WorkerSymmetricNS(this.postJob);

  protected handleCompletedJob(event: MessageEvent<CompletedJob<Action>>) {
    const { jobID, ...result } = event.data;

    const callback = this.pendingJobs[jobID];

    if (!callback) {
      return console.warn(
        `Enclave KMS: Job [${jobID}]: finished with status: ${JSON.stringify({
          ok: event.data.ok,
        })} but no callback found.`,
      );
    }

    callback(result);
    delete this.pendingJobs[jobID];
  }
}
