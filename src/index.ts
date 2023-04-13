import { ClusterManager, WorkerManager } from './classes';
import { IKeyManager } from './interfaces';

export * from './classes';
export * from './interfaces';
export * from './types';

export function createKeyManager(clusterCount = 1): IKeyManager {
  if (clusterCount == 1) {
    return new WorkerManager();
  } else {
    return new ClusterManager(clusterCount);
  }
}
