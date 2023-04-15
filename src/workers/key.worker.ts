import { PrivateKeyMap } from '../classes';
import type {
  WorkerJob,
  WorkerDecryptJob,
  WorkerDecryptResponse,
  WorkerEncryptJob,
  WorkerEncryptResponse,
  WorkerErrorResponse,
  WorkerPutJob,
  WorkerPutResponse,
} from '../interfaces';
import type { KeyManagerAction } from '../types';

const privateKeyMap = new PrivateKeyMap();

self.onmessage = (event: MessageEvent<WorkerJob<never, never>>) => {
  const job = event.data;
  const action: KeyManagerAction = job.action; // { action } = job as Types.WorkerJob<KeyManagerAction, never>;

  switch (action) {
    case 'put':
      return self.postMessage(put(job));

    case 'decrypt':
      return self.postMessage(decrypt(job));

    case 'encrypt':
      return self.postMessage(encrypt(job));

    default:
      return self.postMessage(createErrorResponse('Invalid action', job));
  }
};

function createErrorResponse(error: string, job: WorkerJob<KeyManagerAction, unknown>): WorkerErrorResponse {
  const { action, jobID } = job;

  const response: WorkerErrorResponse = {
    action,
    error,
    jobID,
    ok: false,
  };

  self.postMessage(response);

  throw `Key Manager: ${action} job failed: ${error}.`;
}

function getPrivateKeyOrFail(job: WorkerJob<KeyManagerAction, unknown>): string {
  const { privateKeyID } = job;

  const privateKey = privateKeyMap.get(privateKeyID);

  if (!privateKey) {
    throw createErrorResponse(`Key '${privateKeyID}' not found`, job);
  }

  return privateKey;
}

function decrypt(job: WorkerDecryptJob): WorkerDecryptResponse {
  const privateKey = getPrivateKeyOrFail(job);

  throw createErrorResponse('Decrypt jobs not implemented', job);
}

function encrypt(job: WorkerEncryptJob): WorkerEncryptResponse {
  const privateKey = getPrivateKeyOrFail(job);

  throw createErrorResponse('Encrypt jobs not implemented', job);
}

function put(job: WorkerPutJob): WorkerPutResponse {
  const { action, data, jobID, privateKeyID } = job;

  privateKeyMap.set(privateKeyID, data);

  return {
    action,
    jobID,
    ok: true,
  };
}
