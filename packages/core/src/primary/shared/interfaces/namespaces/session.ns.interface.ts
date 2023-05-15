import type {
  ExportSessionResult,
  ImportSessionRequest,
  ImportSessionResult,
} from '../../../../shared/interfaces/payloads';

export interface ISessionNS {
  /** Clear the KMS & destroy the active session. */
  destroy(): Promise<void>;

  /** Export an encrypted snapshot of the current KMS state. */
  export(): Promise<ExportSessionResult>;

  /** Import a previously exported KMS session. */
  import<T extends boolean>(request: ImportSessionRequest<T>): Promise<ImportSessionResult<T>>;
}
