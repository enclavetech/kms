import type { PrivateKey } from 'openpgp';
import type { PrivateKeyID } from '../../types';

export interface KeyManagerPutRequest {
  action: 'put';
  data: PrivateKey;
  privateKeyID?: PrivateKeyID;
}
