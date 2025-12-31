/**
 * ANS client example
 */

import { ANSClient } from '../src';

async function main() {
  const ans = new ANSClient('https://ans.veritrust.vc');
  
  console.log('Resolving agent name...');
  const agent = await ans.resolve({
    name: 'fraud-detector.risk.bank.example.agent'
  });
  
  console.log('\nAgent Card:');
  console.log(`  Name: ${agent.name}`);
  console.log(`  Version: ${agent.version}`);
  console.log(`  DID: ${agent.did}`);
  console.log(`  Provider: ${agent.provider}`);
  console.log(`  Capabilities: ${agent.capabilities.join(', ')}`);
  console.log(`  Status: ${agent.status}`);
}

main().catch(console.error);
