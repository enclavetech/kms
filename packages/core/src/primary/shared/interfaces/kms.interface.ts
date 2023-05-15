import type { IAsymmetricNS, IHybridNS, IKeysNS, ISessionNS, ISymmetricNS } from './namespaces';

/** Defines the Enclave KMS public API. */
export interface IKMS {
  asymmetric: IAsymmetricNS;
  hybrid: IHybridNS;
  keys: IKeysNS;
  session: ISessionNS;
  symmetric: ISymmetricNS;
}
