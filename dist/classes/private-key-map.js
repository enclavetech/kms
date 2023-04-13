export class PrivateKeyMap extends Map {
    constructor() {
        super();
    }
    get(privateKeyID) {
        return super.get(privateKeyID);
    }
    set(privateKeyID, privateKey) {
        return super.set(privateKeyID, privateKey);
    }
}
