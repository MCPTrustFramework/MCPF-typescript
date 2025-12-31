import { Policy, DelegationResult, CheckDelegationOptions, RegisterPolicyOptions } from './types';

export class A2ARegistry {
  constructor(
    private baseUrl: string,
    private timeout: number = 30000
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }
  
  async checkDelegation(options: CheckDelegationOptions): Promise<DelegationResult> {
    const params = new URLSearchParams({
      from: options.fromDid,
      to: options.toDid
    });
    if (options.action) {
      params.append('action', options.action);
    }
    
    const response = await fetch(`${this.baseUrl}/a2a/check?${params}`, {
      signal: AbortSignal.timeout(this.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`A2A check failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    let policy: Policy | undefined;
    if (data.policy) {
      policy = {
        id: data.policy.id,
        fromAgent: data.policy.fromAgent,
        toAgent: data.policy.toAgent,
        allowedActions: data.policy.allowedActions,
        constraints: data.policy.constraints,
        status: data.policy.status,
        issuedBy: data.policy.issuedBy,
        validFrom: data.policy.validFrom,
        validUntil: data.policy.validUntil,
        createdAt: data.policy.createdAt
      };
    }
    
    return {
      allowed: data.allowed,
      policy,
      reason: data.reason
    };
  }
  
  async registerPolicy(options: RegisterPolicyOptions): Promise<{ status: string; policyId: string }> {
    const response = await fetch(`${this.baseUrl}/a2a/policies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
      signal: AbortSignal.timeout(this.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`A2A register policy failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getAuditLog(filters: {
    fromDid?: string;
    toDid?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters.fromDid) params.append('from', filters.fromDid);
    if (filters.toDid) params.append('to', filters.toDid);
    if (filters.action) params.append('action', filters.action);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const response = await fetch(`${this.baseUrl}/a2a/audit?${params}`, {
      signal: AbortSignal.timeout(this.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`A2A audit failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.entries || [];
  }
}
