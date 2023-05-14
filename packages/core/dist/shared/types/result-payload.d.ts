import type * as Payloads from '../interfaces/payloads';
import type { ActionMixin } from '../interfaces/mixins/action.mixin';
import type { Payload } from './payload';
/**  Discriminated union that defines the request payloads for each action. */
export type ResultPayload = Payload<'asymmetricDecrypt' | 'hybridDecrypt', Payloads.DecryptResult> | Payload<'asymmetricEncrypt' | 'reencryptSessionKey', Payloads.CryptPayload> | ActionMixin<'destroySession'> | Payload<'exportSession', Payloads.ExportSessionResult> | Payload<'hybridEncrypt', Payloads.HybridEncryptResult> | Payload<'importKeyPair', Payloads.ImportKeysResult> | Payload<'importSession', Payloads.ImportSessionResult<boolean>>;
