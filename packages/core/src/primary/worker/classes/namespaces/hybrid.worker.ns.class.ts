import type {
  AsymmetricCryptPayload,
  CryptResult,
  HybridDecryptRequest,
  HybridEncryptResult,
  ReencryptSessionKeyRequest,
} from '../../../../shared/interfaces/payloads';
import type { Action, Request, Result } from '../../../../shared/types';
import type { IHybridNS } from '../../../shared/interfaces/namespaces';

export class WorkerHybridNS implements IHybridNS {
  constructor(private readonly postJob: <A extends Action>(payload: Request<A>) => Promise<Result<A>>) {}

  async decrypt(payload: HybridDecryptRequest): Promise<CryptResult> {
    return (await this.postJob({ action: 'hybridDecrypt', payload })).payload;
  }

  async encrypt(payload: AsymmetricCryptPayload): Promise<HybridEncryptResult> {
    return (await this.postJob({ action: 'hybridEncrypt', payload })).payload;
  }

  async shareKey(payload: ReencryptSessionKeyRequest): Promise<AsymmetricCryptPayload> {
    return (await this.postJob({ action: 'reencryptSessionKey', payload })).payload;
  }
}
