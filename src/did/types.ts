export interface DIDDocument {
  id: string;
  verificationMethod: VerificationMethod[];
  authentication?: string[];
  assertionMethod?: string[];
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyJwk?: object;
}

export interface VerifiableCredential {
  '@context': string[];
  type: string[];
  issuer: string | { id: string };
  issuanceDate: string;
  credentialSubject: object;
  proof?: object;
}

export interface VerificationResult {
  valid: boolean;
  issuer?: string;
  subject?: string;
  isRevoked: boolean;
  error?: string;
}
