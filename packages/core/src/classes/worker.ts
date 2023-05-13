import type { ILibImpl } from '../interfaces/lib-impl';
import type { Action, CompletedJob, FailedJob, Job } from '../types';
import { kvStoreDelete, kvStoreGet, kvStoreSet } from '../utils/db';

// TODO: break functions into individual files and try and find a DRYer way to wrap them

export class Worker<PrivateKeyType extends object, SessionKeyType extends object> {
  private keyMap: Record<string, PrivateKeyType> = {};

  constructor(private readonly libImpl: ILibImpl<PrivateKeyType, SessionKeyType>) {
    self.onmessage = async (event: MessageEvent<Job<Action>>) => {
      const job = event.data;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handler: (job?: any) => Promise<unknown> = this[job.action].bind(this);

      if (!handler) throw this.errorResponse('No such action', job);

      return self.postMessage(await handler(job));
    };
  }

  protected errorResponse<A extends Action>(error: string, job: Job<A>) {
    const { action, jobID } = job;

    const response: FailedJob<A> = {
      action,
      error,
      jobID,
      ok: false,
    };

    self.postMessage(response);

    throw `Key Manager: ${action} job failed: ${error}.`;
  }

  protected getPrivateKey(keyID: string, job: Job<Action>) {
    const privateKey = this.keyMap[keyID];

    if (!privateKey) {
      throw this.errorResponse(`Key '${keyID}' not found`, job);
    }

    return privateKey;
  }

  private async asymmetricDecrypt(job: Job<'asymmetricDecrypt'>): Promise<CompletedJob<'asymmetricDecrypt'>> {
    const { action, jobID } = job;
    const { kmsKeyID, payload } = job.payload;

    const privateKey = this.getPrivateKey(kmsKeyID, job);

    let decryptedMessage;

    try {
      decryptedMessage = await this.libImpl.decryptWithPrivateKey(payload, privateKey);
    } catch (e) {
      throw this.errorResponse('Unable to decrypt message', job);
    }

    return {
      action,
      jobID,
      ok: true,
      payload: { payload: decryptedMessage },
    };
  }

  private async asymmetricEncrypt(job: Job<'asymmetricEncrypt'>): Promise<CompletedJob<'asymmetricEncrypt'>> {
    const { action, jobID } = job;
    const { kmsKeyID, payload } = job.payload;

    // TODO: use public key
    const privateKey = this.getPrivateKey(kmsKeyID, job);

    let encryptedMessage;

    try {
      encryptedMessage = await this.libImpl.encryptWithPrivateKey(payload, privateKey);
    } catch (e) {
      throw this.errorResponse('Unable to encrypt message', job);
    }

    return {
      action,
      jobID,
      ok: true,
      payload: {
        kmsKeyID,
        payload: encryptedMessage,
      },
    };
  }

  private async destroySession(job: Job<'destroySession'>): Promise<CompletedJob<'destroySession'>> {
    const { action, jobID } = job;

    this.keyMap = {};

    await kvStoreDelete('session_key');

    return {
      action,
      jobID,
      ok: true,
    };
  }

  private async exportSession(job: Job<'exportSession'>): Promise<CompletedJob<'exportSession'>> {
    const { action, jobID } = job;

    const session = {
      keys: new Array<{ id: string; key: string }>(),
    };

    for (const [id, key] of Object.entries(this.keyMap)) {
      session.keys.push({ id, key: await this.libImpl.stringifyPrivateKey(key) });
    }

    const payload = JSON.stringify(session);

    let key: PrivateKeyType;
    let sessionPayload: string;

    try {
      key = await this.libImpl.generatePrivateKey();
    } catch (e) {
      throw this.errorResponse('Failed to generate key', job);
    }

    try {
      sessionPayload = await this.libImpl.encryptWithPrivateKey(payload, key);
    } catch (e) {
      throw this.errorResponse('Failed to encrypt payload', job);
    }

    try {
      await kvStoreSet('session_key', await this.libImpl.stringifyPrivateKey(key));
    } catch (e) {
      throw this.errorResponse('Failed to store session key', job);
    }

    return {
      action,
      jobID,
      ok: true,
      payload: { sessionPayload },
    };
  }

  private async hybridDecrypt(job: Job<'hybridDecrypt'>): Promise<CompletedJob<'hybridDecrypt'>> {
    const { action, jobID } = job;
    const { kmsKeyID, payloadKey, payload } = job.payload;

    const privateKey = this.getPrivateKey(kmsKeyID, job);

    let sessionKey: SessionKeyType;
    let decryptedMessage: string;

    try {
      sessionKey = await this.libImpl.decryptSessionKey(payloadKey, privateKey);
    } catch (e) {
      throw this.errorResponse('Unable to decrypt session key', job);
    }

    try {
      decryptedMessage = await this.libImpl.decryptWithSessionKey(payload, sessionKey);
    } catch (e) {
      throw this.errorResponse('Unable to decrypt message', job);
    }

    return {
      action,
      jobID,
      ok: true,
      payload: { payload: decryptedMessage },
    };
  }

  private async hybridEncrypt(job: Job<'hybridEncrypt'>): Promise<CompletedJob<'hybridEncrypt'>> {
    const { action, jobID } = job;
    const { kmsKeyID, payload } = job.payload;

    // TODO: use public key
    const privateKey = this.getPrivateKey(kmsKeyID, job);

    let sessionKey: SessionKeyType;
    let encryptedMessage: string;
    let encryptedSessionKey: string;

    try {
      sessionKey = await this.libImpl.generateSessionKey(privateKey);
    } catch (e) {
      throw this.errorResponse('Unable to generate session key', job);
    }

    try {
      encryptedMessage = await this.libImpl.encryptWithSessionKey(payload, sessionKey);
    } catch (e) {
      throw this.errorResponse('Unable to encrypt message', job);
    }

    try {
      encryptedSessionKey = await this.libImpl.encryptSessionKey(sessionKey, privateKey);
    } catch (e) {
      throw this.errorResponse('Unable to encrypt session key', job);
    }

    return {
      action,
      jobID,
      ok: true,
      payload: {
        payload: encryptedMessage,
        payloadKey: encryptedSessionKey,
      },
    };
  }

  private async importPrivateKey(job: Job<'importPrivateKey'>): Promise<CompletedJob<'importPrivateKey'>> {
    const { action, jobID } = job;
    const { privateKey: key, keyID } = job.payload;

    try {
      this.keyMap[keyID] = await this.libImpl.parsePrivateKey(key);
    } catch (e) {
      throw this.errorResponse('Failed to parse private key', job);
    }

    return {
      action,
      jobID,
      ok: true,
      payload: { keyIDs: [keyID] },
    };
  }

  private async importSession(job: Job<'importSession'>): Promise<CompletedJob<'importSession'>> {
    const { action, jobID } = job;
    const sessionEncrypted = job.payload.sessionPayload;

    let keyEncoded: string;
    let key: PrivateKeyType;
    let sessionDecrypted: string;
    let session: { keys: Array<{ id: string; key: string }> };

    // TODO: A more DRY way to throw errors

    try {
      keyEncoded = await kvStoreGet('session_key');
      key = await this.libImpl.parsePrivateKey(keyEncoded);
    } catch (e) {
      throw this.errorResponse('No key found for session', job);
    }

    try {
      key = await this.libImpl.parsePrivateKey(keyEncoded);
    } catch (e) {
      throw this.errorResponse('Unable to parse session key', job);
    }

    try {
      sessionDecrypted = await this.libImpl.decryptWithPrivateKey(sessionEncrypted, key);
    } catch (e) {
      throw this.errorResponse('Unable to read message', job);
    }

    try {
      session = JSON.parse(sessionDecrypted);
    } catch (e) {
      throw this.errorResponse('Unable to parse session data', job);
    }

    const keyIDs = new Array<string>();
    let ok = true;

    await Promise.allSettled(
      session.keys.map(async ({ id, key }) => {
        try {
          this.keyMap[id] = await this.libImpl.parsePrivateKey(key);
          keyIDs.push(id);
        } catch (e) {
          ok = false;
        }
      }),
    );

    return {
      action,
      error: ok ? undefined : 'One or more keys could not be parsed',
      jobID,
      ok,
      payload: {
        importedKeyIDs: keyIDs,
        reexported: false,
      },
    };
  }

  private async reencryptSessionKey(job: Job<'reencryptSessionKey'>): Promise<CompletedJob<'reencryptSessionKey'>> {
    const { action, jobID } = job;
    const { decryptKeyID, encryptKeyID, sessionKey } = job.payload;

    const decryptKey = this.getPrivateKey(decryptKeyID, job);

    // TODO: use public key
    const encryptKey = this.getPrivateKey(encryptKeyID, job);

    let decryptedSessionKey: SessionKeyType;
    let encryptedSessionKey: string;

    try {
      decryptedSessionKey = await this.libImpl.decryptSessionKey(sessionKey, decryptKey);
    } catch (e) {
      throw this.errorResponse('Unable to decrypt session key', job);
    }

    try {
      encryptedSessionKey = await this.libImpl.encryptSessionKey(decryptedSessionKey, encryptKey);
    } catch (e) {
      throw this.errorResponse('Unable to encrypt session key', job);
    }

    return {
      action,
      jobID,
      ok: true,
      payload: {
        kmsKeyID: encryptKeyID,
        payload: encryptedSessionKey,
      },
    };
  }
}
