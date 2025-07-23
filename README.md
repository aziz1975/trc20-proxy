# Creating a TRC-20 Token on TRON (Nile Testnet)

This project demonstrates how to deploy and interact with an upgradeable TRC-20 token on TRON's Nile Testnet using a Proxy pattern. The token supports standard ERC20 features, minting, burning, and initializing supply.

---

## Prerequisites

* [Node.js](https://nodejs.org/) (v20+ recommended)
* [TronBox](https://developers.tron.network/docs/tronbox-user-guide)

---

## Setup

Clone this repository and install dependencies:

```bash
git clone https://github.com/aziz1975/trc20-proxy.git
```

```bash
npm install
```

Create a `.env` file at the project root with the following variables:

```env
PRIVATE_KEY_NILE=your_private_key
FULL_NODE_NILE=https://nile.trongrid.io
PROXY_ADDRESS=your_deployed_proxy_address (after deployment)
```

---

## Smart Contracts

### Proxy.sol

The proxy contract delegates calls to an implementation contract, allowing upgradeability:

* Stores implementation address
* Uses delegate calls to forward requests

### MyToken.sol

The token implementation based on OpenZeppelin’s ERC20Upgradeable:

* `initialize(name, symbol, initialSupply)`: Initializes token
* `mint(to, amount)`: Mints new tokens
* `burn(from, amount)`: Burns tokens

---

## Deployment

Deploy contracts to Nile Testnet:

1. Deploy logic contract:

```bash
npx tronbox migrate --network nile
```

* This deploys `MyToken.sol` logic contract first.
* Next, it deploys the proxy and initializes the token with provided parameters (`AHM TRC20 Token`, `AHM`, `1,000,000 tokens`).

---

## Testing

Run on-chain tests (transfer, mint, burn) using the provided JavaScript script:

```bash
node testToken.js
```

This script performs the following:

* Retrieves and prints token metadata (name, symbol, decimals)
* Checks total supply and owner balance
* Transfers 100 tokens to a second account
* Mints 50 additional tokens to the same account
* Burns 20 tokens from that account

---

## Key Scripts

* `1_deploy_logic.js`: Deploys the MyToken implementation
* `2_deploy_proxy.js`: Deploys the Proxy contract and initializes MyToken
* `testToken.js`: Interacts with deployed proxy contract, testing basic token operations

---

## Dependencies

* `@openzeppelin/contracts-upgradeable`: Upgradeable ERC-20 implementation
* `dotenv`: Environment variable management
* `tronweb`: TRON network interaction

---

## Resources

* [TRON Nile Testnet Explorer](https://nile.tronscan.org)
* [OpenZeppelin Upgradeable Contracts](https://docs.openzeppelin.com/upgrades-plugins/writing-upgradeable)

---

## Troubleshooting

* Ensure your private keys and addresses in `.env` are correct.

---

## Contract Verification on Tronscan

When verifying contracts, you might encounter the error:

```
verification failed. Please confirm the correct parameters and try again.
```

**Solution:**

* Ensure the correct compiler version (`v0.8.23`) and optimizer settings (`200 runs`) match exactly.
* `Proxy.sol` requires two constructor parameters:

  * Implementation address (`MyToken` logic contract address)
  * Initialization data (encoded ABI data from deployment script)
* `MyToken.sol` has no constructor arguments.

If verification issues persist:

* Visit: [Contact Tronscan Support](https://nile.tronscan.io/#/tools/contactUs), raise a ticket through "Others".
* Or contact the [Telegram developer group](http://t.me/TronOfficialDevelopersGroupEn).

---

## Adding a Logo to Your Token

* Visit [Token Update Page](https://nile.tronscan.io/#/wallet/tokensCreate)
* Select your token and update your logo.

---

## Updating Token Metadata

Update metadata (name, description, website, etc.):

* Visit [Token Update Page](https://nile.tronscan.io/#/wallet/tokensCreate)
* Select your token and update relevant information.

---

## TronLink Integration

To add the token in TronLink:

* Wait approximately 5–10 minutes for TronLink synchronization.
* If synchronization issues occur, seek help in the [Telegram developer group](http://t.me/TronOfficialDevelopersGroupEn).

---

## Viewing Your Token on Tronscan

To view your token:

* Use the search feature on [Tronscan homepage](https://nile.tronscan.io/) and enter the token name or contract address.

---

## Adding Tokens to Other Wallets (e.g., TrustWallet)

Wallet integration rules vary:

* Contact the specific wallet’s customer service or documentation to determine their integration process.
