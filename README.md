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

