/**
 * Unified MCPF client interface
 */

import { DIDManager, VCVerifier } from './did';
import { ANSClient } from './ans';
import { MCPRegistry } from './registry';
import { A2ARegistry } from './a2a';
import { MCPFConfig } from './types';

export class MCPF {
  public readonly did: DIDManager;
  public readonly ans: ANSClient;
  public readonly registry: MCPRegistry;
  public readonly a2a: A2ARegistry | null;
  
  private config: Required<MCPFConfig>;
  
  constructor(config: MCPFConfig = {}) {
    this.config = {
      ansUrl: config.ansUrl || 'https://ans.veritrust.vc',
      registryUrl: config.registryUrl || 'https://ans.veritrust.vc/mcp',
      a2aUrl: config.a2aUrl || '',
      didResolverUrl: config.didResolverUrl || '',
      timeout: config.timeout || 30000,
      verifySsl: config.verifySsl !== false
    };
    
    this.did = new DIDManager(this.config.didResolverUrl);
    this.ans = new ANSClient(this.config.ansUrl, this.config.timeout);
    this.registry = new MCPRegistry(this.config.registryUrl, this.config.timeout);
    this.a2a = this.config.a2aUrl 
      ? new A2ARegistry(this.config.a2aUrl, this.config.timeout)
      : null;
  }
  
  /**
   * Resolve agent name and verify its credential
   */
  async resolveAndVerify(agentName: string, version?: string) {
    const agentCard = await this.ans.resolve({ name: agentName, version });
    
    if (agentCard.credentialUrl) {
      const verifier = new VCVerifier();
      const verification = await verifier.verifyCredentialUrl(agentCard.credentialUrl);
      (agentCard as any)._verification = verification;
    }
    
    return agentCard;
  }
  
  /**
   * Check if delegation is allowed between agents
   */
  async canDelegate(fromDid: string, toDid: string, action?: string): Promise<boolean> {
    if (!this.a2a) {
      throw new Error('A2A registry not configured');
    }
    
    const result = await this.a2a.checkDelegation({ fromDid, toDid, action });
    return result.allowed;
  }
  
  /**
   * Find MCP servers matching criteria
   */
  async findMcpServer(filters: {
    capability?: string;
    organization?: string;
    country?: string;
  }) {
    return this.registry.search(filters);
  }
}

export { MCPFConfig };
