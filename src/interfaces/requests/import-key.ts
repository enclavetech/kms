import type { PrivateKey } from 'openpgp';
import type { PrivateKeyID } from '../../types';

export interface KeyManagerImportKeyRequest {
  action: 'importKey';
  data: PrivateKey;
  privateKeyID?: PrivateKeyID;
}
