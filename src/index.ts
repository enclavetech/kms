import { KeyWorker, KeyWorkerCluster } from './classes';
import { DEFAULT_CONFIG } from './constants/default-config';
import { IKeyManager, KeyManagerConfig } from './interfaces';

export * from './classes';
export * from './interfaces';
export * from './types';

export function KeyManager(config: KeyManagerConfig = DEFAULT_CONFIG): IKeyManager {
  return config.clusterSize
    ? config.clusterSize > 1
      ? new KeyWorkerCluster(config)
      : new KeyWorker(config)
    : new KeyWorkerCluster(DEFAULT_CONFIG);
}
