import type { SessionPayload } from './session-payload';

export interface ImportSessionRequest extends SessionPayload {
  /**
   * Whether to immediately re-export the session with a new key.
   * This will also invalidate the old one.
   * Defaults to `false`.
   */
  reexport?: boolean;
}
