import { expect } from "chai";
import { ethers } from "hardhat";
import { RelayUltraVerifier, RelayVault, UserUltraVerifier, WIRON } from "../typechain-types";

describe("RelayVault", function () {
  // We define a fixture to reuse the same setup in every test.
  let wIRON: WIRON;
  let relayUltraVerifier: RelayUltraVerifier;
  let userUltraVerifier: UserUltraVerifier;
  let relayVault: RelayVault;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const wIRONFactory = await ethers.getContractFactory("WIRON");
    const relayUltraVerifierFactory = await ethers.getContractFactory("RelayUltraVerifier");
    const userUltraVerifierFactory = await ethers.getContractFactory("UserUltraVerifier");
    const relayVaultFactory = await ethers.getContractFactory("RelayVault");
    wIRON = await wIRONFactory.deploy(1000000000000000000000000000000n);
    await wIRON.waitForDeployment();
    relayUltraVerifier = await relayUltraVerifierFactory.deploy();
    await relayUltraVerifier.waitForDeployment();
    userUltraVerifier = await userUltraVerifierFactory.deploy();
    await userUltraVerifier.waitForDeployment();
    relayVault = (await relayVaultFactory.deploy(
      wIRON.getAddress(),
      userUltraVerifier.getAddress(),
      relayUltraVerifier.getAddress(),
      28200,
      4,
      18,
    )) as RelayVault;
    await relayVault.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have the right ironprice decimals", async function () {
      expect(await relayVault.ironPriceDecimals()).to.equal(4);
    });

    it("Should return correct root sha256 hash", async function () {
      const relayPublicInputs = [
        "0x0000000000000000000000000000000000000000000000000003328b944c4000",
        "0x00000000000000000000000000000000000000000000000000000000000000ed",
        "0x00000000000000000000000000000000000000000000000000000000000000dd",
        "0x0000000000000000000000000000000000000000000000000000000000000044",
        "0x0000000000000000000000000000000000000000000000000000000000000026",
        "0x000000000000000000000000000000000000000000000000000000000000001e",
        "0x00000000000000000000000000000000000000000000000000000000000000bb",
        "0x0000000000000000000000000000000000000000000000000000000000000062",
        "0x00000000000000000000000000000000000000000000000000000000000000a7",
        "0x0000000000000000000000000000000000000000000000000000000000000086",
        "0x0000000000000000000000000000000000000000000000000000000000000060",
        "0x00000000000000000000000000000000000000000000000000000000000000d0",
        "0x0000000000000000000000000000000000000000000000000000000000000014",
        "0x000000000000000000000000000000000000000000000000000000000000007c",
        "0x0000000000000000000000000000000000000000000000000000000000000091",
        "0x0000000000000000000000000000000000000000000000000000000000000028",
        "0x00000000000000000000000000000000000000000000000000000000000000df",
        "0x00000000000000000000000000000000000000000000000000000000000000b2",
        "0x0000000000000000000000000000000000000000000000000000000000000073",
        "0x0000000000000000000000000000000000000000000000000000000000000074",
        "0x000000000000000000000000000000000000000000000000000000000000008b",
        "0x0000000000000000000000000000000000000000000000000000000000000058",
        "0x0000000000000000000000000000000000000000000000000000000000000008",
        "0x00000000000000000000000000000000000000000000000000000000000000e8",
        "0x00000000000000000000000000000000000000000000000000000000000000da",
        "0x0000000000000000000000000000000000000000000000000000000000000019",
        "0x00000000000000000000000000000000000000000000000000000000000000eb",
        "0x0000000000000000000000000000000000000000000000000000000000000064",
        "0x0000000000000000000000000000000000000000000000000000000000000064",
        "0x00000000000000000000000000000000000000000000000000000000000000ee",
        "0x00000000000000000000000000000000000000000000000000000000000000a5",
        "0x00000000000000000000000000000000000000000000000000000000000000dd",
        "0x0000000000000000000000000000000000000000000000000000000000000014",
        "0x000000000000000000000000000000000000000000000000000000003b9aca00",
        "0x0000000000000000000000000000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000000000000000000000000000030",
        "0x0000000000000000000000000000000000000000000000000000000000000078",
        "0x0000000000000000000000000000000000000000000000000000000000000062",
        "0x0000000000000000000000000000000000000000000000000000000000000031",
        "0x0000000000000000000000000000000000000000000000000000000000000044",
        "0x0000000000000000000000000000000000000000000000000000000000000034",
        "0x0000000000000000000000000000000000000000000000000000000000000035",
        "0x0000000000000000000000000000000000000000000000000000000000000033",
        "0x0000000000000000000000000000000000000000000000000000000000000038",
        "0x0000000000000000000000000000000000000000000000000000000000000042",
        "0x0000000000000000000000000000000000000000000000000000000000000034",
        "0x0000000000000000000000000000000000000000000000000000000000000035",
        "0x0000000000000000000000000000000000000000000000000000000000000037",
        "0x0000000000000000000000000000000000000000000000000000000000000031",
        "0x0000000000000000000000000000000000000000000000000000000000000064",
        "0x0000000000000000000000000000000000000000000000000000000000000034",
        "0x0000000000000000000000000000000000000000000000000000000000000031",
        "0x0000000000000000000000000000000000000000000000000000000000000031",
        "0x0000000000000000000000000000000000000000000000000000000000000046",
        "0x0000000000000000000000000000000000000000000000000000000000000030",
        "0x0000000000000000000000000000000000000000000000000000000000000037",
        "0x0000000000000000000000000000000000000000000000000000000000000039",
        "0x0000000000000000000000000000000000000000000000000000000000000036",
        "0x0000000000000000000000000000000000000000000000000000000000000030",
        "0x0000000000000000000000000000000000000000000000000000000000000045",
        "0x0000000000000000000000000000000000000000000000000000000000000046",
        "0x0000000000000000000000000000000000000000000000000000000000000032",
        "0x0000000000000000000000000000000000000000000000000000000000000038",
        "0x0000000000000000000000000000000000000000000000000000000000000033",
        "0x0000000000000000000000000000000000000000000000000000000000000038",
        "0x0000000000000000000000000000000000000000000000000000000000000043",
        "0x0000000000000000000000000000000000000000000000000000000000000065",
        "0x0000000000000000000000000000000000000000000000000000000000000033",
        "0x0000000000000000000000000000000000000000000000000000000000000033",
        "0x0000000000000000000000000000000000000000000000000000000000000037",
        "0x0000000000000000000000000000000000000000000000000000000000000046",
        "0x0000000000000000000000000000000000000000000000000000000000000045",
        "0x0000000000000000000000000000000000000000000000000000000000000031",
        "0x0000000000000000000000000000000000000000000000000000000000000045",
        "0x0000000000000000000000000000000000000000000000000000000000000038",
        "0x0000000000000000000000000000000000000000000000000000000000000030",
        "0x0000000000000000000000000000000000000000000000000000000000000045",
      ];

      expect(await relayVault.getRootSHA256(relayPublicInputs)).to.equal(
        "0xbfd74fd3560bbc57e125c09fccbbedc739947a8ea36240d82227e758384385c9",
      );
    });
  });
});
