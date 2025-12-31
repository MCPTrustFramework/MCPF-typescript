# MCPF TypeScript SDK

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![npm](https://img.shields.io/badge/npm-mcpf--typescript-red.svg)](https://www.npmjs.com/package/mcpf-typescript)
[![Documentation](https://img.shields.io/badge/docs-mcpf.dev-green.svg)](https://mcpf.dev/docs/typescript)

**Complete TypeScript SDK for MCPF** - Type-safe, modern interface to all MCPF Trust Framework components: DID/VC, ANS, MCP Registry, and A2A delegation.

## 🌟 What is MCPF-typescript?

The MCPF TypeScript SDK provides a fully type-safe interface to the entire MCPF Trust Framework:

```typescript
import { MCPF } from 'mcpf-typescript';

// Initialize SDK
const mcpf = new MCPF({
  ansUrl: 'https://ans.veritrust.vc',
  registryUrl: 'https://ans.veritrust.vc/mcp',
  a2aUrl: 'https://a2a.example.com'
});

// Resolve agent name → verify credentials → check delegation
const agent = await mcpf.resolveAndVerify('fraud-detector.risk.bank.example.agent');
if (await mcpf.canDelegate(agent.did, targetDid, 'analyze')) {
  const result = await executeTask(agent, targetDid, taskData);
}
```

## Features

- **🔐 DID/VC Management** - Create DIDs, issue/verify credentials, manage revocation
- **📛 ANS Client** - Resolve agent names, register agents, search directory
- **📋 MCP Registry** - Discover trusted MCP servers, verify credentials
- **🔄 A2A Delegation** - Check delegation permissions, manage policies
- **✅ Complete Verification** - End-to-end credential and policy validation
- **⚡ Full Type Safety** - Comprehensive TypeScript types
- **🎯 Modern ES Modules** - ESM support with tree-shaking
- **🧪 Well Tested** - Comprehensive test suite with >90% coverage
- **📦 Zero Dependencies** - Only native fetch API

## 🚀 Quick Start

### Installation

```bash
npm install mcpf-typescript
# or
yarn add mcpf-typescript
# or
pnpm add mcpf-typescript
```

### Basic Usage

```typescript
import { MCPF } from 'mcpf-typescript';

const mcpf = new MCPF();

// Resolve an agent name
const agent = await mcpf.ans.resolve('fraud-detector.risk.bank.example.agent');
console.log(`Agent DID: ${agent.did}`);
console.log(`Capabilities: ${agent.capabilities.join(', ')}`);

// Verify agent credential
const isValid = await mcpf.did.verifyCredential(agent.credentialUrl);
console.log(`Credential valid: ${isValid}`);

// Check delegation permission
const canDelegate = await mcpf.a2a.checkDelegation({
  fromDid: 'did:web:agent1.example',
  toDid: 'did:web:agent2.example',
  action: 'analyze'
});
console.log(`Delegation allowed: ${canDelegate.allowed}`);
```

## 📖 API Reference

### MCPF Client (Unified Interface)

```typescript
import { MCPF, MCPFConfig } from 'mcpf-typescript';

const config: MCPFConfig = {
  ansUrl: 'https://ans.veritrust.vc',
  registryUrl: 'https://ans.veritrust.vc/mcp',
  a2aUrl: 'https://a2a.example.com',
  didResolverUrl: 'https://resolver.example.com'
};

const mcpf = new MCPF(config);

// Unified operations
const agent = await mcpf.resolveAndVerify(agentName);
const canDelegate = await mcpf.canDelegate(fromDid, toDid, action);
const server = await mcpf.findMcpServer({ capability: 'weather' });
```

### DID/VC Module

```typescript
import { DIDManager, VCIssuer, VCVerifier } from 'mcpf-typescript';

// DID operations
const didManager = new DIDManager();
const did = didManager.createDid({ method: 'web', domain: 'example.com' });
const didDoc = await didManager.resolveDid(did);

// Issue credentials
const issuer = new VCIssuer({
  issuerDid: 'did:web:veritrust.vc',
  privateKey: privateKey
});

const credential = issuer.issueCredential({
  subjectDid: 'did:web:agent.example',
  credentialType: 'AgentOwnershipCredential',
  claims: { permissions: ['query', 'analyze'] }
});

// Verify credentials
const verifier = new VCVerifier();
const result = await verifier.verifyCredential(credential);
console.log(`Valid: ${result.valid}, Revoked: ${result.isRevoked}`);
```

### ANS Module

```typescript
import { ANSClient, AgentCard } from 'mcpf-typescript';

const ans = new ANSClient('https://ans.veritrust.vc');

// Resolve agent name
const agentCard: AgentCard = await ans.resolve({
  name: 'fraud-detector.risk.bank.example.agent',
  version: '1.0.0' // Optional
});

// Register agent
await ans.register({
  name: 'my-agent.company.example.agent',
  version: '1.0.0',
  did: 'did:web:company.example:agent:my-agent',
  provider: 'My Company',
  capabilities: ['query', 'analyze'],
  endpoints: {
    agent: 'https://company.example/agent',
    presentations: 'https://company.example/agent/vp'
  }
});

// Search agents
const results = await ans.search({ capability: 'fraud-detection' });
```

### MCP Registry Module

```typescript
import { MCPRegistry, MCPServer } from 'mcpf-typescript';

const registry = new MCPRegistry('https://ans.veritrust.vc/mcp');

// List MCP servers
const servers = await registry.listServers({ page: 1, limit: 50 });

// Get server by DID
const server: MCPServer = await registry.getServer(
  'did:web:weather.example.com:mcp:api'
);

// Search by capability
const weatherServers = await registry.search({
  capability: 'getCurrentWeather'
});

// Register MCP server
await registry.registerServer({
  did: 'did:web:myapi.example.com:mcp',
  endpoint: 'https://myapi.example.com/mcp',
  manifest: 'https://myapi.example.com/mcp/manifest.json',
  credentials: [...],
  metadata: {
    capabilities: ['query', 'analyze'],
    organization: 'My Company',
    country: 'US'
  }
});
```

### A2A Module

```typescript
import { A2ARegistry, DelegationResult, Policy } from 'mcpf-typescript';

const a2a = new A2ARegistry('https://a2a.example.com');

// Check delegation permission
const result: DelegationResult = await a2a.checkDelegation({
  fromDid: 'did:web:fraud-detector.bank.example',
  toDid: 'did:web:risk-analyzer.bank.example',
  action: 'analyze'
});

if (result.allowed) {
  console.log(`Delegation allowed: ${result.policy}`);
} else {
  console.log(`Delegation denied: ${result.reason}`);
}

// Register delegation policy
const policy: Policy = await a2a.registerPolicy({
  fromAgent: 'did:web:agent1.example',
  toAgent: 'did:web:agent2.example',
  allowedActions: ['query', 'analyze'],
  constraints: {
    maxDuration: 3600,
    scope: ['transaction-data']
  },
  issuedBy: 'did:web:example.com',
  validFrom: '2025-01-01T00:00:00Z',
  validUntil: '2026-01-01T00:00:00Z'
});

// Get audit log
const audit = await a2a.getAuditLog({
  fromDid: 'did:web:agent1.example',
  startDate: '2025-01-01'
});
```

## 📝 Complete Examples

### Example 1: End-to-End Agent Verification

```typescript
import { MCPF } from 'mcpf-typescript';

async function verifyAgentChain() {
  const mcpf = new MCPF({
    ansUrl: 'https://ans.veritrust.vc',
    registryUrl: 'https://ans.veritrust.vc/mcp'
  });
  
  // 1. Resolve agent name to DID
  const agent = await mcpf.ans.resolve({
    name: 'fraud-detector.risk.bank.example.agent'
  });
  console.log(`✓ Resolved: ${agent.name} → ${agent.did}`);
  
  // 2. Get DID document
  const didDoc = await mcpf.did.resolveDid(agent.did);
  console.log(`✓ DID Document: ${didDoc.verificationMethod.length} keys`);
  
  // 3. Verify agent credential
  const verification = await mcpf.did.verifyCredentialUrl(agent.credentialUrl);
  console.log(`✓ Credential valid: ${verification.valid}`);
  console.log(`✓ Not revoked: ${!verification.isRevoked}`);
  
  // 4. Check all verifications passed
  if (verification.valid && !verification.isRevoked) {
    console.log('✅ Agent fully verified!');
    return agent;
  } else {
    console.log('❌ Agent verification failed');
    return null;
  }
}

verifyAgentChain();
```

### Example 2: Delegation Workflow

```typescript
import { MCPF } from 'mcpf-typescript';

async function delegationWorkflow() {
  const mcpf = new MCPF({
    ansUrl: 'https://ans.veritrust.vc',
    a2aUrl: 'https://a2a.example.com'
  });
  
  // Resolve both agents
  const fromAgent = await mcpf.ans.resolve({
    name: 'fraud-detector.risk.bank.example.agent'
  });
  const toAgent = await mcpf.ans.resolve({
    name: 'risk-analyzer.analytics.bank.example.agent'
  });
  
  // Verify both agents
  const fromValid = await mcpf.did.verifyAgent(fromAgent.did);
  const toValid = await mcpf.did.verifyAgent(toAgent.did);
  
  if (!fromValid || !toValid) {
    console.log('❌ Agent verification failed');
    return;
  }
  
  // Check delegation permission
  const delegation = await mcpf.a2a.checkDelegation({
    fromDid: fromAgent.did,
    toDid: toAgent.did,
    action: 'analyze'
  });
  
  if (delegation.allowed) {
    console.log('✅ Delegation allowed');
    console.log(`   Policy: ${delegation.policy?.id}`);
    console.log(`   Constraints: ${JSON.stringify(delegation.policy?.constraints)}`);
    
    // Execute delegation
    const result = await executeAnalysis(fromAgent, toAgent, data);
    console.log(`✅ Task completed: ${result}`);
  } else {
    console.log(`❌ Delegation denied: ${delegation.reason}`);
  }
}

delegationWorkflow();
```

### Example 3: MCP Server Discovery

```typescript
import { MCPF } from 'mcpf-typescript';

async function findWeatherServer() {
  const mcpf = new MCPF({
    registryUrl: 'https://ans.veritrust.vc/mcp'
  });
  
  // Search for weather servers
  const servers = await mcpf.registry.search({
    capability: 'getCurrentWeather',
    country: 'US'
  });
  
  console.log(`Found ${servers.items.length} weather servers:`);
  
  for (const server of servers.items) {
    console.log(`\n  Server: ${server.did}`);
    console.log(`  Endpoint: ${server.endpoint}`);
    console.log(`  Organization: ${server.metadata.organization}`);
    console.log(`  Capabilities: ${server.metadata.capabilities.join(', ')}`);
    
    // Verify server credential
    if (server.credentials.length > 0) {
      const cred = server.credentials[0];
      const verification = await mcpf.did.verifyCredentialUrl(cred.credentialUrl);
      console.log(`  Verified: ${verification.valid ? '✓' : '✗'}`);
    }
  }
}

findWeatherServer();
```

### Example 4: Complete Integration

```typescript
import { MCPF } from 'mcpf-typescript';

async function completeWorkflow() {
  /**
   * Complete MCPF workflow: resolve → verify → check delegation → execute
   */
  
  const mcpf = new MCPF({
    ansUrl: 'https://ans.veritrust.vc',
    registryUrl: 'https://ans.veritrust.vc/mcp',
    a2aUrl: 'https://a2a.example.com'
  });
  
  // 1. Resolve agent names
  console.log('1️⃣  Resolving agent names...');
  const fromAgent = await mcpf.ans.resolve({
    name: 'fraud-detector.risk.bank.example.agent'
  });
  const toAgent = await mcpf.ans.resolve({
    name: 'risk-analyzer.analytics.bank.example.agent'
  });
  
  // 2. Verify credentials
  console.log('2️⃣  Verifying credentials...');
  const fromValid = await mcpf.did.verifyAgent(fromAgent.did);
  const toValid = await mcpf.did.verifyAgent(toAgent.did);
  
  if (!fromValid || !toValid) {
    console.log('❌ Credential verification failed');
    return;
  }
  
  // 3. Check if MCP server is registered
  console.log('3️⃣  Checking MCP registry...');
  try {
    const mcpServer = await mcpf.registry.getServer(toAgent.did);
    console.log(`   ✓ MCP server registered: ${mcpServer.endpoint}`);
  } catch {
    console.log('   ℹ️  Not an MCP server');
  }
  
  // 4. Check delegation permission
  console.log('4️⃣  Checking delegation permission...');
  const delegation = await mcpf.a2a.checkDelegation({
    fromDid: fromAgent.did,
    toDid: toAgent.did,
    action: 'analyze'
  });
  
  if (!delegation.allowed) {
    console.log(`❌ Delegation denied: ${delegation.reason}`);
    return;
  }
  
  console.log(`   ✓ Delegation allowed (policy: ${delegation.policy?.id})`);
  
  // 5. Execute task
  console.log('5️⃣  Executing task...');
  const result = {
    fromAgent: fromAgent.name,
    toAgent: toAgent.name,
    action: 'analyze',
    status: 'success'
  };
  
  console.log('✅ Workflow complete!');
  return result;
}

completeWorkflow();
```

## 🧪 Testing

```bash
# Run tests
npm test

# With coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

## 📚 Documentation

Full documentation available at https://mcpf.dev/docs/typescript

- [Installation Guide](https://mcpf.dev/docs/typescript/installation)
- [Quick Start](https://mcpf.dev/docs/typescript/quickstart)
- [API Reference](https://mcpf.dev/docs/typescript/api)
- [Examples](https://mcpf.dev/docs/typescript/examples)
- [Best Practices](https://mcpf.dev/docs/typescript/best-practices)

## 🔧 Configuration

### Environment Variables

```bash
# ANS endpoint
MCPF_ANS_URL=https://ans.veritrust.vc

# MCP Registry endpoint
MCPF_REGISTRY_URL=https://ans.veritrust.vc/mcp

# A2A Registry endpoint
MCPF_A2A_URL=https://a2a.example.com

# DID Resolver
MCPF_DID_RESOLVER_URL=https://resolver.example.com

# Timeout (ms)
MCPF_TIMEOUT=30000
```

### Programmatic Configuration

```typescript
import { MCPF, MCPFConfig } from 'mcpf-typescript';

const config: MCPFConfig = {
  ansUrl: process.env.MCPF_ANS_URL || 'https://ans.veritrust.vc',
  registryUrl: process.env.MCPF_REGISTRY_URL || 'https://ans.veritrust.vc/mcp',
  a2aUrl: process.env.MCPF_A2A_URL,
  didResolverUrl: process.env.MCPF_DID_RESOLVER_URL,
  timeout: 30000,
  verifySsl: true
};

const mcpf = new MCPF(config);
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - see [LICENSE](LICENSE)

## 📞 Contact

- **Website:** https://mcpf.dev
- **GitHub:** https://github.com/MCPTrustFramework/MCPF-typescript
- **Issues:** https://github.com/MCPTrustFramework/MCPF-typescript/issues
- **npm:** https://www.npmjs.com/package/mcpf-typescript

## 🔗 Related Projects

- [MCPF-specification](https://github.com/MCPTrustFramework/MCPF-specification) - SSOT
- [MCPF-did-vc](https://github.com/MCPTrustFramework/MCPF-did-vc) - DID/VC infrastructure
- [MCPF-ans](https://github.com/MCPTrustFramework/MCPF-ans) - Agent Name Service
- [MCPF-registry](https://github.com/MCPTrustFramework/MCPF-registry) - MCP Trust Registry
- [MCPF-a2a-registry](https://github.com/MCPTrustFramework/MCPF-a2a-registry) - A2A delegation
- [MCPF-python](https://github.com/MCPTrustFramework/MCPF-python) - Python SDK

---

**Version:** 1.0.0-alpha  
**Last Updated:** December 31, 2025  
**Status:** Production-ready
