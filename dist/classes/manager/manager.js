export class KeyManager {
    constructor() {
        this.idCounter = 0;
    }
    getNextID() {
        return (this.idCounter++).toString();
    }
}
