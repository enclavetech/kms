import { createMessage, decrypt, decryptSessionKeys, encrypt, generateKey, generateSessionKey, readMessage, readPrivateKey, encryptSessionKey, readKey, } from 'openpgp';
export class PGPLibImpl {
    async decryptSessionKey(armoredMessage, decryptionKeys) {
        const message = await readMessage({ armoredMessage });
        return (await decryptSessionKeys({ message, decryptionKeys }))[0];
    }
    async decryptWithPrivateKey(armoredMessage, decryptionKeys) {
        const message = await readMessage({ armoredMessage });
        return (await decrypt({ message, decryptionKeys })).data;
    }
    async decryptWithSessionKey(armoredMessage, sessionKeys) {
        const message = await readMessage({ armoredMessage });
        return (await decrypt({ message, sessionKeys })).data;
    }
    encryptSessionKey(sessionKey, encryptionKeys) {
        return encryptSessionKey({ format: 'armored', encryptionKeys, ...sessionKey });
    }
    /** @deprecated */
    async encryptWithPrivateKey(text, encryptionKeys) {
        const message = await createMessage({ text });
        return await encrypt({ message, encryptionKeys });
    }
    async encryptWithPublicKey(text, encryptionKeys) {
        const message = await createMessage({ text });
        return await encrypt({ message, encryptionKeys });
    }
    async encryptWithSessionKey(text, sessionKey) {
        const message = await createMessage({ text });
        return await encrypt({ message, sessionKey });
    }
    async generatePrivateKey() {
        return (await generateKey({ format: 'object', userIDs: {} })).privateKey;
    }
    generateSessionKey(encryptionKeys) {
        return generateSessionKey({ encryptionKeys });
    }
    parsePrivateKey(armoredKey) {
        return readPrivateKey({ armoredKey });
    }
    parsePublicKey(armoredKey) {
        return readKey({ armoredKey });
    }
    stringifyPrivateKey(key) {
        return key.armor();
    }
    stringifyPublicKey(key) {
        return key.armor();
    }
    async symmetricDecrypt(armoredMessage, passwords) {
        const message = await readMessage({ armoredMessage });
        return (await decrypt({ message, passwords })).data;
    }
    async symmetricEncrypt(text, passwords) {
        const message = await createMessage({ text });
        return await encrypt({ message, passwords });
    }
}
