import type { KeyWorkerMessage, KeyManagerResponse } from '../interfaces';

export type WorkerCallback = (error: Error | null, result?: KeyManagerResponse) => void;

export class KeyManager {
  private readonly worker = new Worker(new URL('../workers/key.worker.js?worker', import.meta.url), {
    type: 'module',
  });
  private readonly pendingRequests = new Map<number, WorkerCallback>();
  private requestCounter = 0;

  constructor() {
    this.worker.onmessage = (event: MessageEvent) => {
      const response = event.data as KeyManagerResponse;
      const callback = this.pendingRequests.get(response.requestID);

      if (!callback) {
        return console.warn(
          `Key Manager: Request [${response.requestID}]: finished with status: ${JSON.stringify({
            ok: response.ok,
          })} but no callback found.`
        );
      }

      if (response.ok) {
        callback(null, response);
      } else if (response.error instanceof Error) {
        callback(response.error);
      } else {
        callback(new Error(response.error));
      }

      this.pendingRequests.delete(response.requestID);
    };
  }

  postMessage(message: KeyWorkerMessage, callback: WorkerCallback) {
    const requestID = this.requestCounter++;
    this.pendingRequests.set(requestID, callback);
    this.worker.postMessage({ ...message, requestID });
  }

  put(id: string, armoredKey: string) {
    return new Promise<KeyManagerResponse>((resolve, reject) => {
      this.postMessage(
        {
          action: 'put',
          id,
          payload: armoredKey,
        },
        (error, result) => {
          error || !result ? reject(error) : resolve(result);
        }
      );
    });
  }

  decrypt(id: string, payload: string) {
    return new Promise<KeyManagerResponse>((resolve, reject) => {
      this.postMessage(
        {
          action: 'decrypt',
          id,
          payload,
        },
        (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  encrypt(id: string, payload: string) {
    return new Promise<KeyManagerResponse>((resolve, reject) => {
      this.postMessage(
        {
          action: 'encrypt',
          id,
          payload,
        },
        (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
}
