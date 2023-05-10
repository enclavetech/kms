import type { ILibImpl } from '../interfaces/lib-impl';
import type { KmsAction } from '../types/action';
import type {
  KmsJob,
  DecryptJob,
  EncryptJob,
  HybridDecryptJob,
  HybridEncryptJob,
  KeyImportJob,
  SessionDestroyJob,
  SessionExportJob,
  SessionImportJob,
} from '../types/job';
import type {
  DecryptResponse,
  EncryptResponse,
  HybridDecryptResponse,
  HybridEncryptResponse,
  KeyImportResponse,
  KmsResponse,
  SessionDestroyResponse,
  SessionExportResponse,
  SessionImportResponse,
} from '../types/response';
import { kvStoreDelete, kvStoreGet, kvStoreSet } from '../utils/db';

export class Worker<PrivateKeyType extends object, SessionKeyType extends object> {
  private keyMap: Record<string, PrivateKeyType> = {};

  constructor(private readonly libImpl: ILibImpl<PrivateKeyType, SessionKeyType>) {
    self.onmessage = async (event: MessageEvent<KmsJob<KmsAction, never>>) => {
      const job = event.data;

      try {
        switch (job.action) {
          case 'importKey':
            return self.postMessage(await this.importKeyJob(job as KeyImportJob));

          case 'destroySession':
            return self.postMessage(await this.destroySessionJob(job as SessionDestroyJob));

          case 'exportSession':
            return self.postMessage(await this.exportSessionJob(job as SessionExportJob));

          case 'importSession':
            return self.postMessage(await this.importSessionJob(job as SessionImportJob));

          case 'decrypt':
            return self.postMessage(await this.decryptJob(job as DecryptJob));

          case 'encrypt':
            return self.postMessage(await this.encryptJob(job as EncryptJob));

          case 'hybridDecrypt':
            return self.postMessage(await this.hybridDecryptJob(job as HybridDecryptJob));

          case 'hybridEncrypt':
            return self.postMessage(await this.hybridEncryptJob(job as HybridEncryptJob));
        }
      } catch (e) {
        console.error(e);
        throw this.errorResponse('Unexpected error', job);
      }
    };
  }

  protected errorResponse<A extends KmsAction, T>(error: string, job: KmsJob<A, T>) {
    const { action, jobID } = job;

    const response: KmsResponse<A, undefined> = {
      action,
      error,
      jobID,
      ok: false,
      payload: undefined,
    };

    self.postMessage(response);

    throw `Key Manager: ${action} job failed: ${error}.`;
  }

  protected getPrivateKey<T = void>(keyID: string, job: KmsJob<KmsAction, T>) {
    const privateKey = this.keyMap[keyID];

    if (!privateKey) {
      throw this.errorResponse(`Key '${keyID}' not found`, job);
    }

    return privateKey;
  }

  private async importKeyJob(job: KeyImportJob): Promise<KeyImportResponse> {
    const { action, jobID } = job;
    const { key, keyID } = job.payload;

    try {
      this.keyMap[keyID] = await this.libImpl.parsePrivateKey(key);
    } catch (e) {
      throw this.errorResponse('Failed to parse private key', job);
    }

    return {
      action,
      jobID,
      ok: true,
      payload: keyID,
    };
  }

  private async destroySessionJob(job: SessionDestroyJob): Promise<SessionDestroyResponse> {
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

  private async exportSessionJob(job: SessionExportJob): Promise<SessionExportResponse> {
    const { action, jobID } = job;

    const session = {
      keys: new Array<{ id: string; key: string }>(),
    };

    for (const [id, key] of Object.entries(this.keyMap)) {
      session.keys.push({ id, key: await this.libImpl.stringifyPrivateKey(key) });
    }

    const payload = JSON.stringify(session);

    let key: PrivateKeyType;
    let sessionEncrypted: string;

    try {
      key = await this.libImpl.generatePrivateKey();
    } catch (e) {
      throw this.errorResponse('Failed to generate key', job);
    }

    try {
      sessionEncrypted = await this.libImpl.encryptWithPrivateKey(payload, key);
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
      payload: sessionEncrypted,
    };
  }

  private async importSessionJob(job: SessionImportJob): Promise<SessionImportResponse> {
    const { action, jobID } = job;

    const sessionEncrypted = job.payload;

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
      payload: keyIDs,
    };
  }

  private async decryptJob(job: DecryptJob): Promise<DecryptResponse> {
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
      payload: decryptedMessage,
    };
  }

  private async encryptJob(job: EncryptJob): Promise<EncryptResponse> {
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

  private async hybridDecryptJob(job: HybridDecryptJob): Promise<HybridDecryptResponse> {
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
      payload: decryptedMessage,
    };
  }

  private async hybridEncryptJob(job: HybridEncryptJob): Promise<HybridEncryptResponse> {
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
}
