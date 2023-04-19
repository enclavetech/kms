import { createMessage, decrypt, encrypt, generateKey, readMessage, readPrivateKey, } from 'openpgp';
const keyMap = new Map();
self.onmessage = async (event) => {
    const job = event.data;
    const action = job.action;
    switch (action) {
        case 'importKey':
            return self.postMessage(await importKeyJob(job));
        case 'destroySession':
            return self.postMessage(destroySessionJob(job));
        case 'exportSession':
            return self.postMessage(await exportSessionJob(job));
        case 'importSession':
            return self.postMessage(await importSessionJob(job));
        case 'decrypt':
            return self.postMessage(await decryptJob(job));
        case 'encrypt':
            return self.postMessage(await encryptJob(job));
    }
};
function createErrorResponse(error, job) {
    const { action, jobID } = job;
    const response = {
        action,
        error,
        jobID,
        ok: false,
    };
    self.postMessage(response);
    throw `Key Manager: ${action} job failed: ${error}.`;
}
function getPrivateKeyOrFail(job) {
    const { keyID } = job;
    const privateKey = keyMap.get(keyID);
    if (!privateKey) {
        throw createErrorResponse(`Key '${keyID}' not found`, job);
    }
    return privateKey;
}
async function importKeyJob(job) {
    const { action, data: armoredKey, jobID, keyID } = job;
    const key = await readPrivateKey({ armoredKey });
    keyMap.set(keyID, key);
    return {
        action,
        jobID,
        keyID,
        ok: true,
    };
}
function destroySessionJob(job) {
    const { action, jobID } = job;
    // TODO
    throw createErrorResponse('Not implemented', job);
    return {
        action,
        jobID,
        ok: true,
    };
}
async function exportSessionJob(job) {
    const { action, jobID } = job;
    const sessionExport = {
        keys: new Array(),
    };
    for (const [id, key] of keyMap) {
        sessionExport.keys.push({ id, armoredKey: key.armor() });
    }
    const text = JSON.stringify(sessionExport);
    const message = await createMessage({ text });
    // Generate a new key & save it
    const { privateKey } = await generateKey({ format: 'object', userIDs: {} });
    try {
        await saveSessionKey(privateKey.armor());
    }
    catch (e) {
        throw createErrorResponse('Failed to save session key', job);
    }
    const data = await encrypt({ message, encryptionKeys: privateKey });
    return {
        action,
        data,
        jobID,
        ok: true,
    };
}
async function importSessionJob(job) {
    const { action, data: armoredMessage, jobID } = job;
    let privateKey;
    try {
        privateKey = await retrieveSessionKey().then((armoredKey) => readPrivateKey({ armoredKey }));
    }
    catch (e) {
        throw createErrorResponse('No key found for session', job);
    }
    const message = await readMessage({ armoredMessage });
    const decryptedMessage = await decrypt({ message, decryptionKeys: privateKey });
    const sessionData = JSON.parse(decryptedMessage.data);
    await Promise.all(sessionData.keys.map(async ({ id, armoredKey }) => {
        const key = await readPrivateKey({ armoredKey });
        keyMap.set(id, key);
    }));
    return {
        action,
        jobID,
        ok: true,
    };
}
// TODO: importExportSessionJob
async function decryptJob(job) {
    const { action, data: text, jobID, keyID } = job;
    const privateKey = getPrivateKeyOrFail(job);
    const message = await createMessage({ text });
    const decryptedMessage = await decrypt({ message, decryptionKeys: privateKey });
    const data = decryptedMessage.data.toString();
    return {
        action,
        data,
        jobID,
        keyID,
        ok: true,
    };
}
async function encryptJob(job) {
    const { action, data: text, jobID, keyID } = job;
    const privateKey = getPrivateKeyOrFail(job);
    const message = await createMessage({ text });
    const data = await encrypt({ message, encryptionKeys: privateKey });
    return {
        action,
        data,
        jobID,
        keyID,
        ok: true,
    };
}
// TODO: move indexeddb operations to a utils file and optimise
function saveSessionKey(value) {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open('enclave_km', 1);
        openRequest.onupgradeneeded = (event) => {
            event.target.result.createObjectStore('kv', { keyPath: 'key' });
        };
        openRequest.onerror = (errorEvent) => {
            reject(errorEvent.target.error);
        };
        openRequest.onsuccess = (event) => {
            const putRequest = event.target.result
                .transaction('kv', 'readwrite')
                .objectStore('kv')
                .put({ key: 'session_key', value });
            putRequest.onerror = (errorEvent) => {
                reject(errorEvent.target.error);
            };
            putRequest.onsuccess = () => {
                resolve();
            };
        };
    });
}
function retrieveSessionKey() {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open('enclave_km', 1);
        openRequest.onerror = (errorEvent) => {
            reject(errorEvent.target.error);
        };
        openRequest.onsuccess = (event) => {
            const getRequest = event.target.result
                .transaction('kv', 'readwrite')
                .objectStore('kv')
                .get('session_key');
            getRequest.onerror = (errorEvent) => {
                reject(errorEvent.target.error);
            };
            getRequest.onsuccess = () => {
                resolve(getRequest.result.value);
            };
        };
    });
}
