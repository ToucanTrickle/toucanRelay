# ToucanRelay

🧪 ToucanRelay Bot is a user-friendly transaction relay bot that any crypto newbie can use to transfer crypto to any wallet account anonymously. The ToucanRelay bot uses Ironfish as a funding layer used to compensate the bot for the total amount relayed through transactions.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

## Contents

- [Requirements](#requirements)
- [Quickstart](#quickstart)

## Requirements

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with ToucanRelay, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/ToucanTrickle/toucanRelay.git
cd toucanRelay
yarn install
```

2. Run a ironfish wallet server:

```
cd packages/ironfish
cp .env.sample .env
```

Update the .env variables and then:

```
node index.js
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the contracts to Arbitrum Sepolia:

```
yarn deploy --network arbitrumSepolia
```

This command deploys the smart contract to the Arbitrum Sepolia network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
cp .env.sample .env
```

Update the .env variables, then -

```
yarn start
```

Visit your app on: `http://localhost:3000`.
