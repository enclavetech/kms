import { PrivateKeyMap } from '../classes';
const privateKeyMap = new PrivateKeyMap();
self.onmessage = (event) => {
    const job = event.data;
    const action = job.action; // { action } = job as Types.WorkerJob<KeyManagerAction, never>;
    switch (action) {
        case 'put':
            return self.postMessage(put(job));
        case 'decrypt':
            return self.postMessage(decrypt(job));
        case 'encrypt':
            return self.postMessage(encrypt(job));
        default:
            return self.postMessage(createErrorResponse('Invalid action', job));
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
    const { privateKeyID } = job;
    const privateKey = privateKeyMap.get(privateKeyID);
    if (!privateKey) {
        throw createErrorResponse(`Key '${privateKeyID}' not found`, job);
    }
    return privateKey;
}
function decrypt(job) {
    const privateKey = getPrivateKeyOrFail(job);
    throw createErrorResponse('Decrypt jobs not implemented', job);
}
function encrypt(job) {
    const privateKey = getPrivateKeyOrFail(job);
    throw createErrorResponse('Encrypt jobs not implemented', job);
}
function put(job) {
    const { action, data, jobID, privateKeyID } = job;
    privateKeyMap.set(privateKeyID, data);
    return {
        action,
        jobID,
        ok: true,
    };
}
