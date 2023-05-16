export type Action =
  | 'asymmetricDecrypt'
  | 'asymmetricEncrypt'
  | 'destroySession'
  | 'exportSession'
  | 'hybridDecrypt'
  | 'hybridEncrypt'
  | 'importKeyPair'
  | 'importSession'
  // TODO: rename to `hybridShareKey`
  | 'reencryptSessionKey'
  | 'symmetricDecrypt'
  | 'symmetricEncrypt';
