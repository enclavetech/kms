import type * as Payload from '../interfaces/payloads';
import type { PayloadBase } from '../interfaces/payload-base';

/**  Discriminated union that defines the request payloads for each action. */
export type RequestPayload =
  | PayloadBase<'asymmetricDecrypt' | 'asymmetricEncrypt' | 'hybridEncrypt', Payload.CryptPayload>
  | PayloadBase<'destroySession' | 'exportSession'>
  | PayloadBase<'hybridDecrypt', Payload.HybridDecryptRequest>
  | PayloadBase<'importPrivateKey', Payload.ImportPrivateKeyRequest>
  | PayloadBase<'importSession', Payload.ImportSessionRequest<boolean>>
  | PayloadBase<'reencryptSessionKey', Payload.ReencryptSessionKeyRequest>;
