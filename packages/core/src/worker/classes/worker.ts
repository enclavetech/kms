import { EnclaveKmsActionError, EnclaveKmsError } from '../../shared';
import type { Action, CompletedJob, FailedJob, Job } from '../../shared/types';
import type { ILibImpl } from '../interfaces/lib-impl';
import { kvStoreDelete, kvStoreGet, kvStoreSet } from '../utils/db';
import { WrappedLibImpl } from './wrapped-lib-impl';

// TODO: break functions into individual files and try and find a DRYer way to wrap them

export class Worker<PrivateKeyType extends object, SessionKeyType extends object> {
  private readonly libImpl: WrappedLibImpl<PrivateKeyType, SessionKeyType>;
  private keyMap: Record<string, PrivateKeyType> = {};

  constructor(libImpl: ILibImpl<PrivateKeyType, SessionKeyType>) {
    this.libImpl = new WrappedLibImpl(libImpl);

    self.onmessage = async (event: MessageEvent<Job<Action>>) => {
      const job: Job<Action> = event.data;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handler: (job?: any) => Promise<unknown> = this[job.action].bind(this);

      if (!handler) throw this.errorResponse('No such action', job);

      return self.postMessage(await handler(job));
    };
  }

  /**
   * Ensures an error response message is sent on exception.
   * @param fn The function to wrap.
   * @param job The job being processed.
   * @returns The return from `fn`.
   */
  private async wrap<T>(fn: () => T, job: Job<Action>): Promise<Awaited<T>> {
    try {
      return await fn();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      this.errorResponse(errorMessage, job);
      throw e instanceof EnclaveKmsError ? e : new EnclaveKmsError(errorMessage);
    }
  }

  private errorResponse<A extends Action>(error: string, job: Job<A>): void {
    const { action, jobID } = job;

    const response: FailedJob<A> = {
      action,
      error,
      jobID,
      ok: false,
    };

    self.postMessage(response);
  }

  private getPrivateKey(keyID: string, job: Job<Action>): PrivateKeyType {
    const privateKey = this.keyMap[keyID];

    if (!privateKey) {
      throw new EnclaveKmsActionError(job.action, `Key '${keyID}' not found`);
    }

    return privateKey;
  }

  private asymmetricDecrypt = (job: Job<'asymmetricDecrypt'>): Promise<CompletedJob<'asymmetricDecrypt'>> =>
    this.wrap(async () => {
      const { action, jobID } = job;
      const { kmsKeyID, payload } = job.payload;

      const privateKey = this.getPrivateKey(kmsKeyID, job);

      const decryptedMessage = await this.libImpl.decryptWithPrivateKey(payload, privateKey);

      return {
        action,
        jobID,
        ok: true,
        payload: { payload: decryptedMessage },
      };
    }, job);

  private asymmetricEncrypt = (job: Job<'asymmetricEncrypt'>): Promise<CompletedJob<'asymmetricEncrypt'>> =>
    this.wrap(async () => {
      const { action, jobID } = job;
      const { kmsKeyID, payload } = job.payload;

      // TODO: use public key
      const privateKey = this.getPrivateKey(kmsKeyID, job);

      const encryptedMessage = await this.libImpl.encryptWithPrivateKey(payload, privateKey);

      return {
        action,
        jobID,
        ok: true,
        payload: {
          kmsKeyID,
          payload: encryptedMessage,
        },
      };
    }, job);

  private destroySession = (job: Job<'destroySession'>): Promise<CompletedJob<'destroySession'>> =>
    this.wrap(async () => {
      const { action, jobID } = job;

      // clear all keys from memory
      this.keyMap = {};

      // clear stored session key
      await kvStoreDelete('session_key');

      return { action, jobID, ok: true };
    }, job);

  private exportSession = (job: Job<'exportSession'>): Promise<CompletedJob<'exportSession'>> =>
    this.wrap(async () => {
      const { action, jobID } = job;

      const session = {
        // TODO: interface
        keys: new Array<{ id: string; key: string }>(),
      };

      for (const [id, key] of Object.entries(this.keyMap)) {
        session.keys.push({ id, key: await this.libImpl.stringifyPrivateKey(key) });
      }

      const payload = JSON.stringify(session);

      const key = await this.libImpl.generatePrivateKey();

      const [sessionPayload] = await Promise.all([
        this.libImpl.encryptWithPrivateKey(payload, key),

        // Store the session key
        kvStoreSet('session_key', await this.wrap(() => this.libImpl.stringifyPrivateKey(key), job)),
      ]);

      return {
        action,
        jobID,
        ok: true,
        payload: { sessionPayload },
      };
    }, job);

  private hybridDecrypt = (job: Job<'hybridDecrypt'>): Promise<CompletedJob<'hybridDecrypt'>> =>
    this.wrap(async () => {
      const { action, jobID } = job;
      const { kmsKeyID, payloadKey, payload } = job.payload;

      const privateKey = this.getPrivateKey(kmsKeyID, job);

      const sessionKey = await this.libImpl.decryptSessionKey(payloadKey, privateKey);

      const decryptedMessage = await this.libImpl.decryptWithSessionKey(payload, sessionKey);

      return {
        action,
        jobID,
        ok: true,
        payload: { payload: decryptedMessage },
      };
    }, job);

  private hybridEncrypt = (job: Job<'hybridEncrypt'>): Promise<CompletedJob<'hybridEncrypt'>> =>
    this.wrap(async () => {
      const { action, jobID } = job;
      const { kmsKeyID, payload } = job.payload;

      // TODO: use public key
      const privateKey = this.getPrivateKey(kmsKeyID, job);

      const sessionKey = await this.libImpl.generateSessionKey(privateKey);

      const [encryptedMessage, encryptedSessionKey] = await Promise.all([
        this.libImpl.encryptWithSessionKey(payload, sessionKey),
        this.libImpl.encryptSessionKey(sessionKey, privateKey),
      ]);

      return {
        action,
        jobID,
        ok: true,
        payload: {
          payload: encryptedMessage,
          payloadKey: encryptedSessionKey,
        },
      };
    }, job);

  private importPrivateKey = (job: Job<'importPrivateKey'>): Promise<CompletedJob<'importPrivateKey'>> =>
    this.wrap(async () => {
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
    }, job);

  private importSession = (job: Job<'importSession'>): Promise<CompletedJob<'importSession'>> =>
    this.wrap(async () => {
      const { action, jobID } = job;
      const sessionEncrypted = job.payload.sessionPayload;

      const keyEncoded = await kvStoreGet('session_key').catch(() => {
        throw new EnclaveKmsActionError(job.action, 'No session key found');
      });

      const key = await this.libImpl.parsePrivateKey(keyEncoded);

      const sessionDecrypted = await this.libImpl.decryptWithPrivateKey(sessionEncrypted, key);

      const session: {
        // TODO: interface
        keys: Array<{ id: string; key: string }>;
      } = (() => {
        try {
          return JSON.parse(sessionDecrypted);
        } catch (e) {
          throw new EnclaveKmsActionError(job.action, 'Unable to parse session data');
        }
      })();

      const importedKeyIDs = new Array<string>();
      let ok = true;

      await Promise.allSettled(
        session.keys.map(async ({ id, key }) => {
          try {
            this.keyMap[id] = await this.libImpl.parsePrivateKey(key);
            importedKeyIDs.push(id);
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
          importedKeyIDs,
          reexported: false,
        },
      };
    }, job);

  private reencryptSessionKey = (job: Job<'reencryptSessionKey'>): Promise<CompletedJob<'reencryptSessionKey'>> =>
    this.wrap(async () => {
      const { action, jobID } = job;
      const { decryptKeyID, encryptKeyID, sessionKey } = job.payload;

      const decryptKey = this.getPrivateKey(decryptKeyID, job);
      const encryptKey = this.getPrivateKey(encryptKeyID, job); // TODO: use public key

      const decryptedSessionKey = await this.libImpl.decryptSessionKey(sessionKey, decryptKey);
      const encryptedSessionKey = await this.libImpl.encryptSessionKey(decryptedSessionKey, encryptKey);

      return {
        action,
        jobID,
        ok: true,
        payload: {
          kmsKeyID: encryptKeyID,
          payload: encryptedSessionKey,
        },
      };
    }, job);
}
