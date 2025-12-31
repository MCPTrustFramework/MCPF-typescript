import { VerifiableCredential } from './types';

export interface VCIssuerConfig {
  issuerDid: string;
  privateKey: any;
}

export class VCIssuer {
  constructor(private config: VCIssuerConfig) {}
  
  issueCredential(options: {
    subjectDid: string;
    credentialType: string;
    claims: Record<string, any>;
    validFrom?: Date;
    validUntil?: Date;
  }): VerifiableCredential {
    const credential: VerifiableCredential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/ns/credentials/v2'
      ],
      type: ['VerifiableCredential', options.credentialType],
      issuer: { id: this.config.issuerDid },
      issuanceDate: (options.validFrom || new Date()).toISOString(),
      credentialSubject: {
        id: options.subjectDid,
        ...options.claims
      }
    };
    
    if (options.validUntil) {
      (credential as any).validUntil = options.validUntil.toISOString();
    }
    
    // TODO: Add proof/signature
    
    return credential;
  }
}
