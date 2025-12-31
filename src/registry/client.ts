import { MCPServer, ServerList, SearchFilters, MCPServerMetadata } from './types';

export class MCPRegistry {
  constructor(
    private baseUrl: string = 'https://ans.veritrust.vc/mcp',
    private timeout: number = 30000
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }
  
  async listServers(options: { page?: number; limit?: number } = {}): Promise<ServerList> {
    const params = new URLSearchParams({
      page: String(options.page || 1),
      limit: String(options.limit || 50)
    });
    
    const response = await fetch(`${this.baseUrl}/servers?${params}`, {
      signal: AbortSignal.timeout(this.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`Registry list failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      page: data.page,
      limit: data.limit,
      total: data.total,
      items: data.items.map(this.parseServer)
    };
  }
  
  async getServer(did: string): Promise<MCPServer> {
    const encoded = encodeURIComponent(did);
    const response = await fetch(`${this.baseUrl}/servers/${encoded}`, {
      signal: AbortSignal.timeout(this.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`Registry get server failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return this.parseServer(data);
  }
  
  async search(filters: SearchFilters): Promise<ServerList> {
    const params = new URLSearchParams();
    if (filters.capability) params.append('capability', filters.capability);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.organization) params.append('organization', filters.organization);
    if (filters.country) params.append('country', filters.country);
    
    const response = await fetch(`${this.baseUrl}/search?${params}`, {
      signal: AbortSignal.timeout(this.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`Registry search failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    const items = data.items.map(this.parseServer);
    
    return {
      page: 1,
      limit: items.length,
      total: items.length,
      items
    };
  }
  
  async registerServer(server: {
    did: string;
    endpoint: string;
    manifest: string;
    credentials: any[];
    metadata: Record<string, any>;
  }): Promise<{ status: string; did: string }> {
    const response = await fetch(`${this.baseUrl}/servers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(server),
      signal: AbortSignal.timeout(this.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`Registry register failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  private parseServer(data: any): MCPServer {
    const metadata: MCPServerMetadata = {
      capabilities: data.metadata?.capabilities || [],
      organization: data.metadata?.organization,
      country: data.metadata?.country,
      tags: data.metadata?.tags || [],
      status: data.metadata?.status || 'active'
    };
    
    return {
      did: data.did,
      endpoint: data.endpoint,
      manifest: data.manifest,
      credentials: data.credentials || [],
      metadata
    };
  }
}
