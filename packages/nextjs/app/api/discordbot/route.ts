import { createWalletClient, getContract, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as chains from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";

export async function POST(req: Request) {
  try {
    const account = privateKeyToAccount(`0x${String(process.env.NEXT_PUBLIC_RELAY_EVM_PRIVATE_KEY)}`);
    const reqData = await req.json();
    const walletClient = createWalletClient({
      account,
      chain: chains.arbitrumSepolia,
      transport: http(),
    });

    const contractData = getContract({
      abi: deployedContracts[[reqData.chainId] as unknown as keyof typeof deployedContracts].RelayVault.abi, //figure out why cannot directly input chainId
      address: deployedContracts[[reqData.chainId] as unknown as keyof typeof deployedContracts].RelayVault.address,
      walletClient: walletClient,
    });

    if (reqData.transferAsset == "0x0000000000000000000000000000000000000000") {
      const tx = await contractData.write.relayEth([
        reqData.userProof,
        reqData.userPublicInputs,
        reqData.relayProof,
        reqData.relayPublicInputs,
        reqData.amount,
        reqData.receiverAddress,
      ]);
      return new Response(JSON.stringify({ transaction: tx }));
    } else {
      const tx = await contractData.write.relay([
        reqData.userProof,
        reqData.userPublicInputs,
        reqData.relayProof,
        reqData.relayPublicInputs,
        reqData.amount,
        reqData.transferAsset,
        reqData.receiverAddress,
      ]);
      return new Response(JSON.stringify({ transaction: tx }));
    }
  } catch (e) {
    console.log(e);
    return new Response(`Error executing transaction ${e}`, { status: 500 });
  }
}
