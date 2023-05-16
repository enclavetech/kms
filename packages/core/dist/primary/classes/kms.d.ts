import type { KmsConfig } from '../interfaces/kms-config';
import { AsymmetricNS, HybridNS, KeysNS, SessionNS, SymmetricNS } from './namespaces';
export declare abstract class KMS {
    private readonly cluster;
    private currentWorker;
    constructor(workerConstructor: () => Worker, config?: KmsConfig);
    private readonly postJobSingle;
    private readonly postJobAll;
    readonly asymmetric: AsymmetricNS;
    readonly hybrid: HybridNS;
    readonly keys: KeysNS;
    readonly session: SessionNS;
    readonly symmetric: SymmetricNS;
}
