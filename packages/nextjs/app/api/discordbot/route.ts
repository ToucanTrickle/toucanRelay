import { createPublicClient, createWalletClient, getContract, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { chainIdToChain } from "~~/constants/constants";
import deployedContracts from "~~/contracts/deployedContracts";

export async function POST(req: Request) {
  try {
    const account = privateKeyToAccount(`0x${String(process.env.RELAY_EVM_PRIVATE_KEY)}`);
    const reqData = await req.json();

    const publicClient = createPublicClient({
      chain: chainIdToChain[[reqData.chainId] as unknown as keyof typeof chainIdToChain],
      transport: http(),
    });

    const walletClient = createWalletClient({
      account,
      chain: chainIdToChain[[reqData.chainId] as unknown as keyof typeof chainIdToChain],
      transport: http(),
    });

    const contractData = getContract({
      abi: deployedContracts[[reqData.chainId] as unknown as keyof typeof deployedContracts].RelayVault.abi, //figure out why cannot directly input chainId
      address: deployedContracts[[reqData.chainId] as unknown as keyof typeof deployedContracts].RelayVault.address,
      walletClient: walletClient,
      publicClient,
    });

    const relayIronPrice = await contractData.read.ironPrice();
    const relayIronPriceDecimals = await contractData.read.ironDecimals();

    const cmcResp = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=IRON`, {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": String(process.env.NEXT_PUBLIC_CMC_API_KEY),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
      },
    });
    const cmcData = await cmcResp.json();
    const IronPriceUSD = parseInt((cmcData.data.IRON.quote.USD.price * 10 ** relayIronPriceDecimals).toString());

    if (Math.abs(Number(relayIronPrice) - IronPriceUSD) > 5000) {
      await contractData.write.updateIronPrice([BigInt(IronPriceUSD), relayIronPriceDecimals]);
    }

    if (reqData.transferAsset == "0x0000000000000000000000000000000000000000") {
      const tx = await contractData.write.relayEth([
        reqData.userProof,
        reqData.userPublicInputs,
        reqData.relayProof,
        reqData.relayPublicInputs,
        reqData.amount,
        reqData.receiverAddress,
        reqData.memo,
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
        reqData.memo,
      ]);
      return new Response(JSON.stringify({ transaction: tx }));
    }
  } catch (e) {
    console.log(e);
    return new Response(`Error executing transaction ${e}`, { status: 500 });
  }
}
