import {
  createMessage,
  decrypt,
  encrypt,
  generateKey,
  PrivateKey,
  readMessage,
  readPrivateKey,
} from 'openpgp';
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
  WorkerDestroySessionJob,
  WorkerDestroySessionResponse,
} from '../interfaces';
import type { KeyManagerAction, PrivateKeyID } from '../types';
import type { IKeyIdMixin } from '../interfaces';
import { kvStoreDelete, kvStoreGet, kvStoreSet } from '../utils/db';

let keyMap: Record<PrivateKeyID, PrivateKey> = {};

self.onmessage = async (event: MessageEvent<WorkerJob<KeyManagerAction>>) => {
  const job = event.data;
  const action = job.action;

  switch (action) {
    case 'importKey':
      return self.postMessage(await importKeyJob(job as WorkerImportKeyJob));

    case 'destroySession':
      return self.postMessage(await destroySessionJob(job as WorkerDestroySessionJob));

    case 'exportSession':
      return self.postMessage(await exportSessionJob(job as WorkerExportSessionJob));

    case 'importSession':
      return self.postMessage(await importSessionJob(job as WorkerImportSessionJob));

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

  const privateKey = keyMap[keyID];

  if (!privateKey) {
    throw createErrorResponse(`Key '${keyID}' not found`, job);
  }

  return privateKey;
}

async function importKeyJob(job: WorkerImportKeyJob): Promise<WorkerImportKeyResponse> {
  const { action, data: armoredKey, jobID, keyID } = job;

  const key = await readPrivateKey({ armoredKey });

  keyMap[keyID] = key;

  return {
    action,
    jobID,
    keyID,
    ok: true,
  };
}

async function destroySessionJob(job: WorkerDestroySessionJob): Promise<WorkerDestroySessionResponse> {
  const { action, jobID } = job;

  const sessionKeyDeletePromise = kvStoreDelete('session_key');

  keyMap = {};

  await sessionKeyDeletePromise;

  return {
    action,
    jobID,
    ok: true,
  };
}

async function exportSessionJob(job: WorkerExportSessionJob): Promise<WorkerExportSessionResponse> {
  const { action, jobID } = job;

  const sessionExport = {
    keys: new Array<{ id: PrivateKeyID; armoredKey: string }>(),
  };

  for (const [id, key] of Object.entries(keyMap)) {
    sessionExport.keys.push({ id, armoredKey: key.armor() });
  }

  const text = JSON.stringify(sessionExport);
  const message = await createMessage({ text });

  // Generate a new key & save it
  const { privateKey } = await generateKey({ format: 'object', userIDs: {} });
  try {
    await kvStoreSet('session_key', privateKey.armor());
  } catch (e) {
    throw createErrorResponse<'exportSession'>('Failed to save session key', job);
  }

  const data = await encrypt({ message, encryptionKeys: privateKey });

  return {
    action,
    data,
    jobID,
    ok: true,
  };
}

async function importSessionJob(job: WorkerImportSessionJob): Promise<WorkerImportSessionResponse> {
  const { action, data: armoredMessage, jobID } = job;

  let privateKey: PrivateKey;

  try {
    privateKey = await kvStoreGet('session_key').then((armoredKey) => readPrivateKey({ armoredKey }));
  } catch (e) {
    throw createErrorResponse<'importSession'>('No key found for session', job);
  }

  const message = await readMessage({ armoredMessage });
  const decryptedMessage = await decrypt({ message, decryptionKeys: privateKey });
  const sessionData: { keys: Array<{ id: PrivateKeyID; armoredKey: string }> } = JSON.parse(
    decryptedMessage.data
  );

  await Promise.all(
    sessionData.keys.map(async ({ id, armoredKey }) => {
      keyMap[id] = await readPrivateKey({ armoredKey });
    })
  );

  return {
    action,
    jobID,
    ok: true,
  };
}

// TODO: importExportSessionJob

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
