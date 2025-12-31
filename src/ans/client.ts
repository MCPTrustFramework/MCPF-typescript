import { AgentCard, ResolveOptions, RegisterOptions } from './types';

export class ANSClient {
  constructor(
    private baseUrl: string = 'https://ans.veritrust.vc',
    private timeout: number = 30000
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }
  
  async resolve(options: ResolveOptions): Promise<AgentCard> {
    const params = new URLSearchParams({ name: options.name });
    if (options.version) {
      params.append('version', options.version);
    }
    
    const response = await fetch(`${this.baseUrl}/resolve?${params}`, {
      signal: AbortSignal.timeout(this.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`ANS resolve failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    const card = data.card;
    
    return {
      name: card.name,
      version: card.version,
      did: card.did,
      provider: card.provider,
      capabilities: card.capabilities || [],
      endpoints: card.endpoints || {},
      status: card.status || 'active',
      meta: card.meta || {},
      issuedAt: card.issued_at,
      jws: data.jws
    };
  }
  
  async register(options: RegisterOptions): Promise<{ ok: boolean; id: string }> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
      signal: AbortSignal.timeout(this.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`ANS register failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async suspend(name: string, version?: string): Promise<{ ok: boolean }> {
    const body: any = { name };
    if (version) body.version = version;
    
    const response = await fetch(`${this.baseUrl}/suspend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`ANS suspend failed: ${response.statusText}`);
    }
    
    return response.json();
  }
}
