import type { ExportSessionResult, ImportSessionRequest, ImportSessionResult } from '../../../shared/interfaces/payloads';
import { NS } from './ns';
export declare class SessionNS extends NS {
    destroy(): Promise<void>;
    export(): Promise<ExportSessionResult>;
    import<T extends boolean>(request: ImportSessionRequest<T>): Promise<ImportSessionResult<T>>;
}
