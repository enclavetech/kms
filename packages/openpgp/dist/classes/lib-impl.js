import { createMessage, decrypt, decryptSessionKeys, encrypt, generateKey, generateSessionKey, readMessage, readPrivateKey, encryptSessionKey, } from 'openpgp';
export class PGPLibImpl {
    stringifyPrivateKey(key) {
        return key.armor();
    }
    async parsePrivateKey(armoredKey) {
        return await readPrivateKey({ armoredKey });
    }
    async decryptSessionKey(armoredMessage, decryptionKeys) {
        const message = await readMessage({ armoredMessage });
        return (await decryptSessionKeys({ message, decryptionKeys }))[0];
    }
    async encryptSessionKey(sessionKey, encryptionKeys) {
        return await encryptSessionKey({ format: 'armored', encryptionKeys, ...sessionKey });
    }
    async generatePrivateKey() {
        return (await generateKey({ format: 'object', userIDs: {} })).privateKey;
    }
    async generateSessionKey(encryptionKeys) {
        return await generateSessionKey({ encryptionKeys });
    }
    async decryptWithPrivateKey(armoredMessage, decryptionKeys) {
        const message = await readMessage({ armoredMessage });
        return (await decrypt({ message, decryptionKeys })).data;
    }
    async decryptWithSessionKey(armoredMessage, sessionKeys) {
        const message = await readMessage({ armoredMessage });
        return (await decrypt({ message, sessionKeys })).data;
    }
    async encryptWithPrivateKey(text, encryptionKeys) {
        const message = await createMessage({ text });
        return await encrypt({ message, encryptionKeys });
    }
    async encryptWithSessionKey(text, sessionKey) {
        const message = await createMessage({ text });
        return await encrypt({ message, sessionKey });
    }
}
