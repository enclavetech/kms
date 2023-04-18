import { KeyManager, KeyWorkerManager, KeyWorkerClusterManager } from './classes';
import { DEFAULT_CONFIG } from './constants';
import { KeyManagerConfig } from './interfaces';

export * from './classes';
export * from './interfaces';
export * from './types';

export function createKeyManager(config: KeyManagerConfig = DEFAULT_CONFIG): KeyManager {
  return config.clusterSize
    ? config.clusterSize > 1
      ? new KeyWorkerClusterManager(config)
      : new KeyWorkerManager(config)
    : new KeyWorkerClusterManager(DEFAULT_CONFIG);
}
