import { PrivateKeyID } from '../../types';
export declare abstract class Manager {
    private idCounter;
    protected getNextID(): PrivateKeyID;
}
