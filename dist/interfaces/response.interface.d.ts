export interface KeyManagerResponse {
    error?: string | Error;
    ok: boolean;
    payload?: string;
    requestID: number;
}
