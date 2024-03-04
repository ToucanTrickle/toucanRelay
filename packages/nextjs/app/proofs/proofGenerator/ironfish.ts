import usercircuit from "../../../../circuits/user_circuit/target/user_circuit.json";
import { BarretenbergBackend, CompiledCircuit } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";

// async function createRawTransaction(from: any, to: any, amount: bigint) {
//   const sdk = await IronfishSdk.init({ dataDir: "~/.ironfish" });
//   const client = await sdk.connectRpc();

//   // const from = 'acc2';
//   // const to = '01ad7aa5a5e8a1e49ed5764179f6950fed680dae74c5fc070dec2e391cc02e95';
//   // const amount = '10';
//   const fee = 1n;
//   const memo = "";
//   const expiration = 173913;
//   const confirmations = 1;

//   const options = {
//     account: from,
//     outputs: [
//       {
//         publicAddress: to,
//         amount: CurrencyUtils.encode(amount),
//         memo,
//         // assetId,
//       },
//     ],
//     fee: CurrencyUtils.encode(fee),
//     expiration,
//     confirmations,
//   };

//   const response = await client.wallet.createTransaction(options);
//   console.log(response);
//   return response;
// }

async function transactionProofs(
  userIdNullifier: string,
  userIdTrapdoor: string,
  userIdCommitment: string,
  ironfishAccount: string,
  amountToSpend: string,
  assetPriceIron: string,
  assetType: string,
  fee: string,
  feePriceIron: string,
  assetAddress: string,
) {
  const userBackend = new BarretenbergBackend(usercircuit as unknown as CompiledCircuit);
  const user = new Noir(usercircuit as unknown as CompiledCircuit, userBackend);
  const userInput = {
    id_commitment: userIdCommitment,
    id_nullifier: userIdNullifier,
    id_trapdoor: userIdTrapdoor,
  };

  const userProof = await user.generateFinalProof(userInput);
  const userProofHex = "0x" + Buffer.from(userProof.proof).toString("hex");
  const userPublicInputArray: string[] = [];
  userProof.publicInputs.forEach(v => userPublicInputArray.push(v));

  const response = await fetch(`${process.env.NEXT_PUBLIC_IRONFISH_DATA_URL}/getUserTransactionProofs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      userIdCommitment: userIdCommitment,
      ironfishAccount: ironfishAccount,
      amountToSpend: amountToSpend,
      assetPriceIron: assetPriceIron,
      assetType: assetType,
      fee: fee,
      feePriceIron: feePriceIron,
      assetAddress: assetAddress,
    }),
  });

  if (response.status == 200) {
    const data = await response.json();
    return {
      userTxProof: { proof: userProofHex, publicInputs: userPublicInputArray },
      relayTxProof: data.relayTxProof,
    };
  } else {
    throw new Error("unable to generate relay proof!");
  }
}

export { transactionProofs };
