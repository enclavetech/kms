import { createMessage, decrypt, decryptSessionKeys, encrypt, encryptSessionKey, enums, generateKey, generateSessionKey, readMessage, readPrivateKey, } from 'openpgp';
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
            case 'hybridDecrypt':
                return self.postMessage(await hybridDecryptJob(job));
            case 'encrypt':
                return self.postMessage(await encryptJob(job));
            case 'hybridEncrypt':
                return self.postMessage(await hybridEncryptJob(job));
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
    const keyIDs = new Array();
    await Promise.all(sessionData.keys.map(async ({ id, armoredKey }) => {
        keyIDs.push(id);
        keyMap[id] = await readPrivateKey({ armoredKey });
    }));
    return {
        action,
        data: keyIDs,
        jobID,
        ok: true,
    };
}
// TODO: importExportSessionJob
async function decryptJob(job) {
    const { action, data: armoredMessage, jobID, keyID } = job;
    // TODO: use public key
    const privateKey = getPrivateKeyOrFail(job);
    let decryptedMessage;
    try {
        const message = await readMessage({ armoredMessage });
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
async function hybridDecryptJob(job) {
    const { action, jobID, keyID } = job;
    const privateKey = getPrivateKeyOrFail(job);
    const messageKeyPromise = readMessage({ armoredMessage: job.data.key })
        .then((message) => decryptSessionKeys({
        decryptionKeys: privateKey,
        message,
    }))
        .then((sessionKeys) => sessionKeys[0])
        .catch(() => {
        throw createErrorResponse('Unable to decrypt message key', job);
    });
    const messagePromise = readMessage({ armoredMessage: job.data.message });
    const [messageKey, message] = await Promise.all([messageKeyPromise, messagePromise]);
    const decryptedMessage = await decrypt({
        message,
        sessionKeys: messageKey,
    });
    const data = decryptedMessage.data.toString();
    return {
        action,
        data,
        jobID,
        keyID,
        ok: true,
    };
}
async function hybridEncryptJob(job) {
    const { action, data: text, jobID, keyID } = job;
    // TODO: use public key
    const privateKey = getPrivateKeyOrFail(job);
    const sessionKey = await generateSessionKey({
        encryptionKeys: privateKey,
        config: {
            preferredSymmetricAlgorithm: enums.symmetric.aes256,
        },
    });
    const encryptedMessagePromise = (async () => {
        const message = await createMessage({ text });
        return encrypt({ message, sessionKey });
    })();
    const encryptedKeyPromise = encryptSessionKey({
        format: 'armored',
        encryptionKeys: privateKey,
        ...sessionKey,
    }).catch(() => {
        throw createErrorResponse('Unable to encrypt message key', job);
    });
    const [key, message] = await Promise.all([encryptedKeyPromise, encryptedMessagePromise]);
    return {
        action,
        data: {
            key,
            message,
        },
        jobID,
        keyID,
        ok: true,
    };
}
