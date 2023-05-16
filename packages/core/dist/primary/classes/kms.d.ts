import type { KmsConfig } from '../interfaces/kms-config';
export declare abstract class KMS {
    private readonly cluster;
    private currentWorker;
    readonly asymmetric: import("./namespaces").AsymmetricNS | undefined;
    readonly hybrid: import("./namespaces").HybridNS | undefined;
    readonly keys: import("./namespaces").KeysNS | undefined;
    readonly session: import("./namespaces").SessionNS | undefined;
    readonly symmetric: import("./namespaces").SymmetricNS | undefined;
    constructor(workerConstructor: () => Worker, config?: KmsConfig);
    private readonly postJobSingle;
    private readonly postJobAll;
}
