import { createMessage, decrypt, decryptKey, decryptSessionKeys, encrypt, encryptKey, generateKey, generateSessionKey, readMessage, readPrivateKey, encryptSessionKey, readKey, } from 'openpgp';
export class Adapter {
    async decryptPrivateKey(armoredKey, passphrase) {
        return await decryptKey({ privateKey: await readPrivateKey({ armoredKey }), passphrase });
    }
    async decryptSessionKey(armoredMessage, decryptionKeys) {
        return (await decryptSessionKeys({ message: await readMessage({ armoredMessage }), decryptionKeys }))[0];
    }
    async decryptWithPrivateKey(armoredMessage, decryptionKeys) {
        return (await decrypt({ message: await readMessage({ armoredMessage }), decryptionKeys })).data;
    }
    async decryptWithSessionKey(armoredMessage, sessionKeys) {
        return (await decrypt({ message: await readMessage({ armoredMessage }), sessionKeys })).data;
    }
    derivePublicKey(privateKey) {
        return privateKey.toPublic();
    }
    async encryptPrivateKey(privateKey, passphrase) {
        return (await encryptKey({ privateKey, passphrase })).armor();
    }
    encryptSessionKey(sessionKey, encryptionKeys) {
        return encryptSessionKey({ format: 'armored', encryptionKeys, ...sessionKey });
    }
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
    generateKeyPair() {
        return generateKey({ format: 'object', userIDs: {} });
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
        return (await decrypt({ message: await readMessage({ armoredMessage }), passwords })).data;
    }
    async symmetricEncrypt(text, passwords) {
        return await encrypt({ message: await createMessage({ text }), passwords });
    }
}
export default Adapter;
