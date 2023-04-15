import { PrivateKeyID } from '../../types';

export abstract class Manager {
  private idCounter = 0;

  protected getNextID(): PrivateKeyID {
    return (this.idCounter++).toString();
  }
}
