import { PrivateKeyID } from '../../types';
export interface IKeyIdMixin {
    keyID: PrivateKeyID;
}
export interface IMaybeKeyIdMixin {
    keyID?: PrivateKeyID;
}
