import type { AsymmetricCryptPayload, CryptResult } from '../../../../shared/interfaces/payloads';
import type { Action, Request, Result } from '../../../../shared/types';
import type { IAsymmetricNS } from '../../../shared/interfaces/namespaces';

export class WorkerAsymmetricNS implements IAsymmetricNS {
  constructor(private readonly postJob: <A extends Action>(payload: Request<A>) => Promise<Result<A>>) {}

  async decrypt(payload: AsymmetricCryptPayload): Promise<CryptResult> {
    return (await this.postJob({ action: 'asymmetricDecrypt', payload })).payload;
  }

  async encrypt(payload: AsymmetricCryptPayload): Promise<AsymmetricCryptPayload> {
    return (await this.postJob({ action: 'asymmetricEncrypt', payload })).payload;
  }
}
