export interface MCPServerMetadata {
  capabilities: string[];
  organization?: string;
  country?: string;
  tags: string[];
  status: string;
}

export interface MCPServer {
  did: string;
  endpoint: string;
  manifest: string;
  credentials: Array<{
    issuer: string;
    type: string;
    credentialUrl: string;
  }>;
  metadata: MCPServerMetadata;
}

export interface ServerList {
  page: number;
  limit: number;
  total: number;
  items: MCPServer[];
}

export interface SearchFilters {
  capability?: string;
  tag?: string;
  organization?: string;
  country?: string;
}
