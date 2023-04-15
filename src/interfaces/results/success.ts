import type { PrivateKeyID } from '../../types';
import type { KeyManagerResult } from './result';

export interface KeyManagerSuccessResult extends KeyManagerResult {
  ok: true;
  privateKeyID: PrivateKeyID;
}
