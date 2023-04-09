const database = new Promise((resolve, reject) => {
    const databaseRequest = self.indexedDB.open('keys', 1);
    databaseRequest.onupgradeneeded = function () {
        databaseRequest.result.createObjectStore('keys', { keyPath: 'id' });
    };
    databaseRequest.onsuccess = function () {
        resolve(databaseRequest.result);
    };
    databaseRequest.onerror = function () {
        reject(databaseRequest.error);
    };
});
const memoryStore = new Map();
self.onmessage = (event) => {
    const { action, id, payload, requestID } = event.data;
    const response = {
        ok: false,
        requestID,
    };
    try {
        switch (action) {
            case 'put':
                memoryStore.set(id, payload);
                database.then((database) => {
                    database.transaction('keys', 'readwrite').objectStore('keys').put({ id, privateKey: payload });
                    response.ok = true;
                    self.postMessage(response);
                });
                break;
            case 'decrypt': {
                getKey(id)
                    .then(() => (response.ok = true))
                    .catch(() => (response.ok = false))
                    .finally(() => self.postMessage(response));
                break;
            }
            case 'encrypt': {
                getKey(id)
                    .then(() => (response.ok = true))
                    .catch(() => (response.ok = false))
                    .finally(() => self.postMessage(response));
                break;
            }
            default:
                response.ok = false;
                response.error = 'Invalid action';
                self.postMessage(response);
                break;
        }
    }
    catch (error) {
        response.ok = false;
        response.error = 'Exceptional exception occurred';
        self.postMessage(response);
    }
};
function getKey(id) {
    return new Promise((resolve, reject) => {
        const memoryKey = memoryStore.get(id);
        if (memoryKey)
            return resolve(memoryKey);
        database.then((database) => {
            const request = database.transaction('keys', 'readonly').objectStore('keys').get(id);
            request.onsuccess = function () {
                console.log(request.result);
                resolve(request.result);
            };
            request.onerror = function () {
                reject(request.error);
            };
        });
    });
}
export {};
