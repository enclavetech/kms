import { KeyWorkerManager, KeyWorkerClusterManager } from './classes';
import { DEFAULT_CONFIG } from './constants';
export * from './classes';
export * from './interfaces';
export * from './types';
export function createKeyManager(config = DEFAULT_CONFIG) {
    return config.clusterSize === 1 ? new KeyWorkerManager(config) : new KeyWorkerClusterManager(config);
}
