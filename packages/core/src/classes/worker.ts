import type { ILibImpl } from '../interfaces/lib-impl';
import type * as Payload from '../interfaces/payloads';
import type { Action, CompletedJob, Job } from '../types';
import { kvStoreDelete, kvStoreGet, kvStoreSet } from '../utils/db';

// TODO: break functions into individual files and try and find a DRYer way to wrap them

export class Worker<PrivateKeyType extends object, SessionKeyType extends object> {
  private keyMap: Record<string, PrivateKeyType> = {};

  constructor(private readonly libImpl: ILibImpl<PrivateKeyType, SessionKeyType>) {
    self.onmessage = async (event: MessageEvent<Job<Action, never>>) => {
      const job = event.data;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handler: (job?: any) => Promise<unknown> = this[job.action];

      if (!handler) throw this.errorResponse('No such action', job);

      return self.postMessage(await handler(job));
    };
  }

  protected errorResponse<A extends Action>(error: string, job: Job<A, unknown>) {
    const { action, jobID } = job;

    const response: CompletedJob<A, undefined> = {
      action,
      error,
      jobID,
      ok: false,
      payload: undefined,
    };

    self.postMessage(response);

    throw `Key Manager: ${action} job failed: ${error}.`;
  }

  protected getPrivateKey(keyID: string, job: Job<Action, unknown>) {
    const privateKey = this.keyMap[keyID];

    if (!privateKey) {
      throw this.errorResponse(`Key '${keyID}' not found`, job);
    }

    return privateKey;
  }

  private async asymmetricDecrypt(
    job: Job<'asymmetricDecrypt', Payload.CryptPayload>,
  ): Promise<CompletedJob<'asymmetricDecrypt', Payload.DecryptResult>> {
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

  private async asymmetricEncrypt(
    job: Job<'asymmetricEncrypt', Payload.CryptPayload>,
  ): Promise<CompletedJob<'asymmetricEncrypt', Payload.CryptPayload>> {
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

  private async destroySession(job: Job<'destroySession', undefined>): Promise<CompletedJob<'destroySession'>> {
    const { action, jobID } = job;

    this.keyMap = {};

    await kvStoreDelete('session_key');

    return {
      action,
      jobID,
      ok: true,
      payload: undefined,
    };
  }

  private async exportSession(
    job: Job<'exportSession', undefined>,
  ): Promise<CompletedJob<'exportSession', Payload.ExportSessionResult>> {
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

  private async hybridDecrypt(
    job: Job<'hybridDecrypt', Payload.HybridDecryptRequest>,
  ): Promise<CompletedJob<'hybridDecrypt', Payload.DecryptResult>> {
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

  private async hybridEncrypt(
    job: Job<'hybridEncrypt', Payload.CryptPayload>,
  ): Promise<CompletedJob<'hybridEncrypt', Payload.HybridEncryptResult>> {
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

  private async importPrivateKey(
    job: Job<'importPrivateKey', Payload.ImportPrivateKeyRequest>,
  ): Promise<CompletedJob<'importPrivateKey', Payload.ImportPrivateKeyResult>> {
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

  private async importSession(
    job: Job<'importSession', Payload.ImportSessionRequest>,
  ): Promise<CompletedJob<'importSession', Payload.ImportSessionResult>> {
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

    const { sessionPayload } = (
      await this.exportSession({
        action: 'exportSession',
        jobID,
        payload: undefined,
      })
    ).payload;

    return {
      action,
      error: ok ? undefined : 'One or more keys could not be parsed',
      jobID,
      ok,
      payload: {
        importedKeyIDs: keyIDs,

        // TODO: make optional
        sessionPayload,
      },
    };
  }

  private async reencryptSessionKey(
    job: Job<'reencryptSessionKey', Payload.ReencryptSessionKeyRequest>,
  ): Promise<CompletedJob<'reencryptSessionKey', Payload.CryptPayload>> {
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
