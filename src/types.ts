/**
 * Common types used across MCPF SDK
 */

export interface MCPFConfig {
  ansUrl?: string;
  registryUrl?: string;
  a2aUrl?: string;
  didResolverUrl?: string;
  timeout?: number;
  verifySsl?: boolean;
}

export interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
}
