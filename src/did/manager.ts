import { DIDDocument } from './types';

export class DIDManager {
  constructor(private resolverUrl?: string) {}
  
  createDid(options: { method: string; domain?: string }): string {
    if (options.method === 'web') {
      if (!options.domain) {
        throw new Error('domain required for did:web');
      }
      return `did:web:${options.domain}`;
    } else if (options.method === 'key') {
      throw new Error('did:key generation not yet implemented');
    } else {
      throw new Error(`Unsupported DID method: ${options.method}`);
    }
  }
  
  async resolveDid(did: string): Promise<DIDDocument> {
    if (did.startsWith('did:web:')) {
      const parts = did.replace('did:web:', '').split(':');
      const domain = parts[0];
      const path = parts.slice(1).join('/');
      
      const url = path
        ? `https://${domain}/${path}/did.json`
        : `https://${domain}/.well-known/did.json`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to resolve DID: ${response.statusText}`);
      }
      
      return response.json();
    } else {
      throw new Error(`Resolution for ${did.split(':')[1]} not implemented`);
    }
  }
}
