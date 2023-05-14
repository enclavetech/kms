import type { SessionKey } from './session-key';
export interface Session {
    keys: Array<SessionKey>;
}
