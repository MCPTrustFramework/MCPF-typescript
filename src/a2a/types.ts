export interface Policy {
  id: string;
  fromAgent: string;
  toAgent: string;
  allowedActions: string[];
  constraints: Record<string, any>;
  status: string;
  issuedBy: string;
  validFrom?: string;
  validUntil?: string;
  createdAt: string;
}

export interface DelegationResult {
  allowed: boolean;
  policy?: Policy;
  reason?: string;
}

export interface CheckDelegationOptions {
  fromDid: string;
  toDid: string;
  action?: string;
}

export interface RegisterPolicyOptions {
  fromAgent: string;
  toAgent: string;
  allowedActions: string[];
  constraints: Record<string, any>;
  issuedBy: string;
  validFrom?: string;
  validUntil?: string;
}
