import type { CryptResult, SymmetricCryptPayload } from '../../../../shared/interfaces/payloads';
import type { Action, Request, Result } from '../../../../shared/types';
import type { ISymmetricNS } from '../../../shared/interfaces/namespaces';

export class WorkerSymmetricNS implements ISymmetricNS {
  constructor(private readonly postJob: <A extends Action>(payload: Request<A>) => Promise<Result<A>>) {}

  async decrypt(payload: SymmetricCryptPayload): Promise<CryptResult> {
    return (await this.postJob({ action: 'symmetricDecrypt', payload })).payload;
  }

  async encrypt(payload: SymmetricCryptPayload): Promise<CryptResult> {
    return (await this.postJob({ action: 'symmetricEncrypt', payload })).payload;
  }
}
