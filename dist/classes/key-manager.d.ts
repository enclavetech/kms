import type { KeyWorkerMessage, KeyManagerResponse } from '../interfaces';
export type WorkerCallback = (error: Error | null, result?: KeyManagerResponse) => void;
export declare class KeyManager {
    private readonly worker;
    private readonly pendingRequests;
    private requestCounter;
    constructor();
    postMessage(message: KeyWorkerMessage, callback: WorkerCallback): void;
    put(id: string, armoredKey: string): Promise<KeyManagerResponse>;
    decrypt(id: string, payload: string): Promise<KeyManagerResponse>;
    encrypt(id: string, payload: string): Promise<KeyManagerResponse>;
}
