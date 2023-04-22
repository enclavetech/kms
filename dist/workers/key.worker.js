import { createMessage, decrypt, encrypt, generateKey, readMessage, readPrivateKey, } from 'openpgp';
import { kvStoreDelete, kvStoreGet, kvStoreSet } from '../utils/db';
let keyMap = {};
self.onmessage = async (event) => {
    const job = event.data;
    const action = job.action;
    try {
        switch (action) {
            case 'importKey':
                return self.postMessage(await importKeyJob(job));
            case 'destroySession':
                return self.postMessage(await destroySessionJob(job));
            case 'exportSession':
                return self.postMessage(await exportSessionJob(job));
            case 'importSession':
                return self.postMessage(await importSessionJob(job));
            case 'decrypt':
                return self.postMessage(await decryptJob(job));
            case 'encrypt':
                return self.postMessage(await encryptJob(job));
        }
    }
    catch (e) {
        console.error(e);
        throw createErrorResponse('Unexpected error', job);
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
    const privateKey = keyMap[keyID];
    if (!privateKey) {
        throw createErrorResponse(`Key '${keyID}' not found`, job);
    }
    return privateKey;
}
async function importKeyJob(job) {
    const { action, data: armoredKey, jobID, keyID } = job;
    const key = await readPrivateKey({ armoredKey });
    keyMap[keyID] = key;
    return {
        action,
        jobID,
        keyID,
        ok: true,
    };
}
async function destroySessionJob(job) {
    const { action, jobID } = job;
    const sessionKeyDeletePromise = kvStoreDelete('session_key');
    keyMap = {};
    await sessionKeyDeletePromise;
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
    for (const [id, key] of Object.entries(keyMap)) {
        sessionExport.keys.push({ id, armoredKey: key.armor() });
    }
    const text = JSON.stringify(sessionExport);
    const message = await createMessage({ text });
    // Generate a new key & save it
    const { privateKey } = await generateKey({ format: 'object', userIDs: {} });
    try {
        await kvStoreSet('session_key', privateKey.armor());
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
        privateKey = await kvStoreGet('session_key').then((armoredKey) => readPrivateKey({ armoredKey }));
    }
    catch (e) {
        throw createErrorResponse('No key found for session', job);
    }
    let decryptedMessage;
    try {
        const message = await readMessage({ armoredMessage });
        decryptedMessage = await decrypt({ message, decryptionKeys: privateKey });
    }
    catch (e) {
        throw createErrorResponse('Unable to read message', job);
    }
    let sessionData;
    try {
        sessionData = JSON.parse(decryptedMessage.data);
    }
    catch (e) {
        throw createErrorResponse('Unable to parse session data', job);
    }
    await Promise.all(sessionData.keys.map(async ({ id, armoredKey }) => {
        keyMap[id] = await readPrivateKey({ armoredKey });
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
    let decryptedMessage;
    try {
        const message = await createMessage({ text });
        decryptedMessage = await decrypt({ message, decryptionKeys: privateKey });
    }
    catch (e) {
        throw createErrorResponse('Unable to read message', job);
    }
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
