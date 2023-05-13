import type * as Payload from '../interfaces/payloads';
import type { PayloadBase } from '../interfaces/payload-base';
/**  Discriminated union that defines the request payloads for each action. */
export type ResultPayload = PayloadBase<'asymmetricDecrypt' | 'hybridDecrypt', Payload.DecryptResult> | PayloadBase<'asymmetricEncrypt' | 'reencryptSessionKey', Payload.CryptPayload> | PayloadBase<'destroySession'> | PayloadBase<'exportSession', Payload.ExportSessionResult> | PayloadBase<'hybridEncrypt', Payload.HybridEncryptResult> | PayloadBase<'importPrivateKey', Payload.ImportPrivateKeyResult> | PayloadBase<'importSession', Payload.ImportSessionResult<boolean>> | PayloadBase<'reencryptSessionKey', Payload.ReencryptSessionKeyRequest>;
