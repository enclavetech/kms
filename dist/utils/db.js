function kvStoreOpen() {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open('enclave_km', 1);
        openRequest.onupgradeneeded = (event) => {
            event.target.result.createObjectStore('kv', { keyPath: 'key' });
        };
        openRequest.onerror = (errorEvent) => {
            reject(errorEvent.target.error);
        };
        openRequest.onsuccess = (event) => {
            resolve(event.target.result.transaction('kv', 'readwrite').objectStore('kv'));
        };
    });
}
export async function kvStoreDelete(key) {
    const kvStore = await kvStoreOpen();
    return await new Promise((resolve, reject) => {
        const deleteRequest = kvStore.delete(key);
        deleteRequest.onerror = (errorEvent) => {
            reject(errorEvent.target.error);
        };
        deleteRequest.onsuccess = () => {
            resolve();
        };
    });
}
export async function kvStoreGet(key) {
    const kvStore = await kvStoreOpen();
    return await new Promise((resolve, reject) => {
        const getRequest = kvStore.get(key);
        getRequest.onerror = (errorEvent) => {
            reject(errorEvent.target.error);
        };
        getRequest.onsuccess = () => {
            resolve(getRequest.result.value);
        };
    });
}
export async function kvStoreSet(key, value) {
    const kvStore = await kvStoreOpen();
    return await new Promise((resolve, reject) => {
        const putRequest = kvStore.put({ key, value });
        putRequest.onerror = (errorEvent) => {
            reject(errorEvent.target.error);
        };
        putRequest.onsuccess = () => {
            resolve();
        };
    });
}
