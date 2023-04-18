import { KeyWorkerManager, KeyWorkerClusterManager } from './classes';
import { DEFAULT_CONFIG } from './constants';
export * from './classes';
export * from './interfaces';
export * from './types';
export function createKeyManager(config = DEFAULT_CONFIG) {
    return config.clusterSize
        ? config.clusterSize > 1
            ? new KeyWorkerClusterManager(config)
            : new KeyWorkerManager(config)
        : new KeyWorkerClusterManager(DEFAULT_CONFIG);
}
