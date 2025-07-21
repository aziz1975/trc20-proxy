require('dotenv').config();
const {TronWeb} = require('tronweb');

// ─── CONFIG ────────────────────────────────────────────────────────────────────
// You can point all three at the same Nile gateway:
const fullNode     = process.env.FULL_NODE_NILE     || 'https://nile.trongrid.io';
const solidityNode = process.env.FULL_NODE_NILE || 'https://nile.trongrid.io';
const eventServer  = process.env.FULL_NODE_NILE  || 'https://nile.trongrid.io';
const privateKey   = process.env.PRIVATE_KEY_NILE;
const proxyAddress = process.env.PROXY_ADDRESS;  // e.g. 'TXYZ...'

// Load your compiled ABI (MyToken ABI, compiled by TronBox)
const { abi: tokenAbi } = require('./build/contracts/MyToken.json');

// ─── SETUP ─────────────────────────────────────────────────────────────────────
if (!privateKey || !proxyAddress) {
  console.error('🌡️  MISSING CONFIG! Please set PRIVATE_KEY and PROXY_ADDRESS in .env');
  process.exit(1);
}

const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
const token   = tronWeb.contract(tokenAbi, proxyAddress);

// ─── HELPERS ────────────────────────────────────────────────────────────────────
const toSun   = (amount) => tronWeb.toSun(amount);
const fromSun = (amount) => tronWeb.fromSun(amount);

// ─── TEST SEQUENCE ──────────────────────────────────────────────────────────────
async function main() {
  console.log('⏳ Fetching token metadata...');
  const [name, symbol, decimals] = await Promise.all([
    token.name().call(),
    token.symbol().call(),
    token.decimals().call(),
  ]);
  console.log(`• Name:     ${name}`);
  console.log(`• Symbol:   ${symbol}`);
  console.log(`• Decimals: ${decimals}`);

  console.log('\n⏳ Fetching totalSupply and owner balance...');
  const owner = tronWeb.defaultAddress.base58;
  const [rawSupply, rawOwnerBal] = await Promise.all([
    token.totalSupply().call(),
    token.balanceOf(owner).call(),
  ]);
  console.log(`• totalSupply: ${fromSun(rawSupply)}`);
  console.log(`• owner balance: ${fromSun(rawOwnerBal)}`);

  // 1) Transfer 100 tokens to a second account
  const recipient = tronWeb.address.fromPrivateKey(process.env.SECOND_PRIVATE_KEY || privateKey);
  console.log(`\n🔄 Transferring 100 tokens to ${recipient}...`);
  let tx = await token.transfer(recipient, toSun(100)).send();
  console.log('  ▶ txID:', tx);

  // wait a few seconds for confirmation (optional)
  await new Promise(r => setTimeout(r, 5000));

  const afterBal = await token.balanceOf(recipient).call();
  console.log(`  ✓ recipient balance: ${fromSun(afterBal)}`);

  // 2) Mint 50 new tokens to recipient
  console.log('\n🔧 Minting 50 tokens to the same address...');
  tx = await token.mint(recipient, toSun(50)).send();
  console.log('  ▶ txID:', tx);
  await new Promise(r => setTimeout(r, 5000));
  console.log(`  ✓ new balance: ${fromSun(await token.balanceOf(recipient).call())}`);

  // 3) Burn 20 tokens from recipient
  console.log('\n🔥 Burning 20 tokens from recipient...');
  tx = await token.burn(recipient, toSun(20)).send();
  console.log('  ▶ txID:', tx);
  await new Promise(r => setTimeout(r, 5000));
  console.log(`  ✓ post-burn balance: ${fromSun(await token.balanceOf(recipient).call())}`);

  console.log('\n✅ All on-chain tests complete!');
}

main().catch(err => {
  console.error('❌ Error in test sequence:', err);
  process.exit(1);
});
