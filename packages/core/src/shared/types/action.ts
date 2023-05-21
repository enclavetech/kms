export type Action =
  | 'asymmetricDecrypt'
  | 'asymmetricEncrypt'
  | 'destroySession'
  | 'encryptPrivateKey'
  | 'exportSession'
  | 'generateKeyPair'
  | 'hybridDecrypt'
  | 'hybridEncrypt'
  | 'importKeyPair'
  | 'importSession'
  | 'reencryptSessionKey' // TODO: rename to `hybridShareKey`
  | 'symmetricDecrypt'
  | 'symmetricEncrypt';
