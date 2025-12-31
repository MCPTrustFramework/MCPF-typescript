export interface AgentCard {
  name: string;
  version: string;
  did: string;
  provider: string;
  capabilities: string[];
  endpoints: Record<string, string>;
  status: string;
  meta: Record<string, any>;
  issuedAt: string;
  jws?: {
    compact: string;
    kid: string;
  };
  credentialUrl?: string;
}

export interface ResolveOptions {
  name: string;
  version?: string;
}

export interface RegisterOptions {
  name: string;
  version: string;
  did: string;
  provider: string;
  capabilities: string[];
  endpoints: Record<string, string>;
  status?: string;
  meta?: Record<string, any>;
}
