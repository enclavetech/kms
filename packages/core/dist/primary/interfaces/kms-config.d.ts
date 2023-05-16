import type { AsymmetricNS, HybridNS, KeysNS, SessionNS, SymmetricNS } from '../classes/namespaces';
import type { NSConstructor } from '../types/ns-constructor';
export interface KmsConfig {
    /**
     * Import `AsymmetricNS` and use it as this value to make the 'asymmetric' API available.
     */
    asymmetric?: NSConstructor<AsymmetricNS>;
    /**
     * Import `HybridNS` and use it as this value to make the 'hybrid' API available.
     */
    hybrid?: NSConstructor<HybridNS>;
    /**
     * Import `KeysNS` and use it as this value to make the 'keys' API available.
     */
    keys?: NSConstructor<KeysNS>;
    /**
     * Import `SessionNS` and use it as this value to make the 'session' API available.
     */
    session?: NSConstructor<SessionNS>;
    /**
     * Import `SymmetricNS` and use it as this value to make the 'symmetric' API available.
     */
    symmetric?: NSConstructor<SymmetricNS>;
    /** Number of web worker processes in the cluster. Defaults to 4. */
    clusterSize?: number;
}
