/**
 * Complete MCPF workflow example
 */

import { MCPF } from '../src';

async function main() {
  console.log('🚀 MCPF Complete Workflow Demo\n');
  
  const mcpf = new MCPF({
    ansUrl: 'https://ans.veritrust.vc',
    registryUrl: 'https://ans.veritrust.vc/mcp',
    a2aUrl: 'https://a2a.example.com'
  });
  
  // 1. Resolve agent names
  console.log('1️⃣  Resolving agent names...');
  try {
    const fromAgent = await mcpf.ans.resolve({
      name: 'fraud-detector.risk.bank.example.agent'
    });
    console.log(`   ✓ From: ${fromAgent.name} → ${fromAgent.did}`);
    
    const toAgent = await mcpf.ans.resolve({
      name: 'risk-analyzer.analytics.bank.example.agent'
    });
    console.log(`   ✓ To: ${toAgent.name} → ${toAgent.did}`);
  } catch (error) {
    console.log(`   ✗ Error resolving agents: ${error}`);
    return;
  }
  
  console.log('\n✅ Workflow complete!');
}

main().catch(console.error);
