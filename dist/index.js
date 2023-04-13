import { ClusterManager, WorkerManager } from './classes';
export * from './classes';
export * from './interfaces';
export * from './types';
export function createKeyManager(clusterCount = 1) {
    if (clusterCount == 1) {
        return new WorkerManager();
    }
    else {
        return new ClusterManager(clusterCount);
    }
}
