import { createMessage, decrypt, encrypt, PrivateKey } from 'openpgp';
// Import specific file rather than index.ts to prevent circular dependency that trips up Vite
import { PrivateKeyMap } from '../classes/private-key-map';
import type {
  WorkerJob,
  WorkerDecryptJob,
  WorkerDecryptResponse,
  WorkerEncryptJob,
  WorkerEncryptResponse,
  WorkerErrorResponse,
  workerImportKeyJob,
  WorkerImportKeyResponse,
} from '../interfaces';
import type { KeyManagerAction } from '../types';

const privateKeyMap = new PrivateKeyMap();

self.onmessage = async (event: MessageEvent<WorkerJob<never, never>>) => {
  const job = event.data;
  const action: KeyManagerAction = job.action;

  switch (action) {
    case 'importKey':
      return self.postMessage(importKeyJob(job));

    case 'decrypt':
      return self.postMessage(await decryptJob(job));

    case 'encrypt':
      return self.postMessage(await encryptJob(job));

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

function getPrivateKeyOrFail(job: WorkerJob<KeyManagerAction, unknown>): PrivateKey {
  const { privateKeyID } = job;

  const privateKey = privateKeyMap.get(privateKeyID);

  if (!privateKey) {
    throw createErrorResponse(`Key '${privateKeyID}' not found`, job);
  }

  return privateKey;
}

async function decryptJob(job: WorkerDecryptJob): Promise<WorkerDecryptResponse> {
  const { action, data: encryptedData, jobID, privateKeyID } = job;

  const privateKey = getPrivateKeyOrFail(job);

  const data = await createMessage({ text: encryptedData })
    .then((message) => decrypt({ message, decryptionKeys: privateKey }))
    .then((message) => message.data.toString());

  return {
    action,
    data,
    jobID,
    ok: true,
    privateKeyID,
  };
}

async function encryptJob(job: WorkerEncryptJob): Promise<WorkerEncryptResponse> {
  const { action, data: encryptedData, jobID, privateKeyID } = job;

  const privateKey = getPrivateKeyOrFail(job);

  const data = await createMessage({ text: encryptedData }).then((message) =>
    encrypt({ message, encryptionKeys: privateKey })
  );

  return {
    action,
    data,
    jobID,
    ok: true,
    privateKeyID,
  };
}

function importKeyJob(job: workerImportKeyJob): WorkerImportKeyResponse {
  const { action, data, jobID, privateKeyID } = job;

  privateKeyMap.set(privateKeyID, data);

  return {
    action,
    jobID,
    ok: true,
    privateKeyID,
  };
}
