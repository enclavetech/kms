import type { PrivateKey, PrivateKeyID } from '../types';

export class PrivateKeyMap extends Map<PrivateKeyID, PrivateKey> {
  constructor() {
    super();
  }

  get(privateKeyID: PrivateKeyID) {
    return super.get(privateKeyID);
  }

  set(privateKeyID: PrivateKeyID, privateKey: PrivateKey) {
    return super.set(privateKeyID, privateKey);
  }
}
