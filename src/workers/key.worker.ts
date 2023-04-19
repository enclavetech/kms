import { createMessage, decrypt, encrypt, PrivateKey } from 'openpgp';
import type {
  WorkerJob,
  WorkerDecryptJob,
  WorkerDecryptResponse,
  WorkerEncryptJob,
  WorkerEncryptResponse,
  WorkerImportKeyJob,
  WorkerImportKeyResponse,
  WorkerFailResponse,
  WorkerExportSessionJob,
  WorkerExportSessionResponse,
  WorkerImportSessionJob,
  WorkerImportSessionResponse,
} from '../interfaces';
import type { KeyManagerAction, PrivateKeyID } from '../types';
import type { IKeyIdMixin } from '../interfaces';

const keyMap = new Map<PrivateKeyID, PrivateKey>();

self.onmessage = async (event: MessageEvent<WorkerJob<KeyManagerAction>>) => {
  const job = event.data;
  const action = job.action;

  switch (action) {
    case 'importKey':
      return self.postMessage(importKeyJob(job as WorkerImportKeyJob));

    case 'exportSession':
      return self.postMessage(exportSessionJob(job as WorkerExportSessionJob));

    case 'importSession':
      return self.postMessage(importSessionJob(job as WorkerImportSessionJob));

    case 'decrypt':
      return self.postMessage(await decryptJob(job as WorkerDecryptJob));

    case 'encrypt':
      return self.postMessage(await encryptJob(job as WorkerEncryptJob));
  }
};

function createErrorResponse<Action extends KeyManagerAction>(
  error: string,
  job: WorkerJob<Action>
): WorkerFailResponse<Action> {
  const { action, jobID } = job;

  const response: WorkerFailResponse<Action> = {
    action,
    error,
    jobID,
    ok: false,
  };

  self.postMessage(response);

  throw `Key Manager: ${action} job failed: ${error}.`;
}

function getPrivateKeyOrFail<Action extends KeyManagerAction>(
  job: WorkerJob<Action> & IKeyIdMixin
): PrivateKey {
  const { keyID } = job;

  const privateKey = keyMap.get(keyID);

  if (!privateKey) {
    throw createErrorResponse(`Key '${keyID}' not found`, job);
  }

  return privateKey;
}

function importKeyJob(job: WorkerImportKeyJob): WorkerImportKeyResponse {
  const { action, data, jobID, keyID } = job;

  keyMap.set(keyID, data);

  return {
    action,
    jobID,
    keyID,
    ok: true,
  };
}

function exportSessionJob(job: WorkerExportSessionJob): WorkerExportSessionResponse {
  const { action, jobID } = job;

  // TODO
  throw createErrorResponse('Not implemented', job);

  return {
    action,
    jobID,
    ok: true,
  };
}

function importSessionJob(job: WorkerImportSessionJob): WorkerImportSessionResponse {
  const { action, data, jobID } = job;

  // TODO
  throw createErrorResponse('Not implemented', job);

  return {
    action,
    jobID,
    ok: true,
  };
}

async function decryptJob(job: WorkerDecryptJob): Promise<WorkerDecryptResponse> {
  const { action, data: text, jobID, keyID } = job;

  const privateKey = getPrivateKeyOrFail(job);

  const message = await createMessage({ text });
  const decryptedMessage = await decrypt({ message, decryptionKeys: privateKey });
  const data = decryptedMessage.data.toString();

  return {
    action,
    data,
    jobID,
    keyID,
    ok: true,
  };
}

async function encryptJob(job: WorkerEncryptJob): Promise<WorkerEncryptResponse> {
  const { action, data: text, jobID, keyID } = job;

  const privateKey = getPrivateKeyOrFail(job);

  const message = await createMessage({ text });
  const data = await encrypt({ message, encryptionKeys: privateKey });

  return {
    action,
    data,
    jobID,
    keyID,
    ok: true,
  };
}
