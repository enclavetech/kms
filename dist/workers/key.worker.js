import { createMessage, decrypt, encrypt } from 'openpgp';
const keyMap = new Map();
self.onmessage = async (event) => {
    const job = event.data;
    const action = job.action;
    switch (action) {
        case 'importKey':
            return self.postMessage(importKeyJob(job));
        case 'destroySession':
            return self.postMessage(destroySessionJob(job));
        case 'exportSession':
            return self.postMessage(exportSessionJob(job));
        case 'importSession':
            return self.postMessage(importSessionJob(job));
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
function importKeyJob(job) {
    const { action, data, jobID, keyID } = job;
    keyMap.set(keyID, data);
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
function exportSessionJob(job) {
    const { action, jobID } = job;
    // TODO
    throw createErrorResponse('Not implemented', job);
    return {
        action,
        data: 'TODO',
        jobID,
        ok: true,
    };
}
function importSessionJob(job) {
    const { action, data, jobID } = job;
    // TODO
    throw createErrorResponse('Not implemented', job);
    return {
        action,
        jobID,
        ok: true,
    };
}
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
