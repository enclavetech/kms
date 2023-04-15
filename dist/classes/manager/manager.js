export class Manager {
    constructor() {
        this.idCounter = 0;
    }
    getNextID() {
        return (this.idCounter++).toString();
    }
}
