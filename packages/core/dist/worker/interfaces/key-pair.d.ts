export interface KeyPair<PrivateKeyType extends object, PublicKeyType extends object> {
    privateKey?: PrivateKeyType;
    publicKey: PublicKeyType;
}
