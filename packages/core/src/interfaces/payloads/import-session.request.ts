import type { SessionPayload } from './session-payload';

export interface ImportSessionRequest extends SessionPayload {
  /**
   * Whether to re-export the session with a new key.
   * Defaults to `false`.
   * @todo Implement.
   * @deprecated Not implemented.
   */
  reexport?: boolean;

  /**
   * Whether to invalidate the session key after importing.
   * Defaults to `true`.
   * @todo Implement.
   * @deprecated Not implemented.
   */
  invalidate?: boolean;
}
