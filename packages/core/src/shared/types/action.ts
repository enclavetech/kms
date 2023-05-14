export type Action =
  | 'asymmetricDecrypt'
  | 'asymmetricEncrypt'
  | 'destroySession'
  | 'exportSession'
  | 'hybridDecrypt'
  | 'hybridEncrypt'
  | 'importKeyPair'
  | 'importSession'
  | 'reencryptSessionKey';