import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "RelayVault" using the deployer account and
 * constructor arguments set to Ironfish token address, RelayUltraverifier address, UserUltraverifier address, and Ironfish token price, decimals, and price decimals
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployRelayVault: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const WIRON = await hre.ethers.getContract<Contract>("WIRON", deployer);
  const userUltraVerifier = await hre.ethers.getContract<Contract>("UserUltraVerifier", deployer);
  const relayUltraVerifier = await hre.ethers.getContract<Contract>("RelayUltraVerifier", deployer);
  const ironPrice = 17800;
  const ironPriceDecimals = 4;
  const ironDecimals = 18;

  await deploy("RelayVault", {
    from: deployer,
    // Contract constructor arguments
    args: [
      await WIRON.getAddress(),
      await userUltraVerifier.getAddress(),
      await relayUltraVerifier.getAddress(),
      ironPrice,
      ironPriceDecimals,
      ironDecimals,
    ],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
};

module.exports = deployRelayVault;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags RelayVault
deployRelayVault.tags = ["RelayVault"];
