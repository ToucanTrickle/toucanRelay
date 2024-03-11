import relaycircuit from "../circuits/relay_circuit/target/relay_circuit.json" assert { type: "json" };
import { CurrencyUtils, IronfishSdk } from "@ironfish/sdk";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import pkg from 'js-sha256';
const { Message, sha256 } = pkg;

async function createRawTransaction(from, to, amount, memo) {
  const sdk = await IronfishSdk.init({ dataDir: "~/.ironfish" });
  const client = await sdk.connectRpc();

  // const from = 'acc2';
  // const to = '01ad7aa5a5e8a1e49ed5764179f6950fed680dae74c5fc070dec2e391cc02e95';
  // const amount = '10';
  const fee = 1n;
  // const memo = "";
  // const expiration = 219515;
  const confirmations = 1;

  const options = {
    account: from,
    outputs: [
      {
        publicAddress: to,
        amount: CurrencyUtils.encode(amount),
        memo,
        // assetId,
      },
    ],
    fee: CurrencyUtils.encode(fee),
    // expiration,
    confirmations,
  };

  const response = await client.wallet.createTransaction(options);
  return response.content;
}

async function transactionProofs(
  userIdCommitment,
  ironfishAccount,
  amountToSpend,
  assetPriceIron,
  assetType,
  fee,
  feePriceIron,
  assetAddress,
) {
  try {
    const sdk = await IronfishSdk.init({ dataDir: "~/.ironfish" });
  
    const relayBackend = new BarretenbergBackend(relaycircuit);
    const relay = new Noir(relaycircuit, relayBackend);
    
    const client = await sdk.connectRpc();
    const confirmations = 1;

    const options = {
      account: ironfishAccount,
      confirmations,
      notes: true
    };

    const response = client.wallet.getAccountTransactionsStream(options);
    let hashPath = sha256.update(new Uint8Array([0, 0, 0])).array();
    let initial_commitment = sha256.update(`0x0000000000000000000000000000000000000000000000000000000000000000`);
    initial_commitment = initial_commitment.update(sha256.update(numToUint8Array(0)).digest());
    initial_commitment = initial_commitment.update(sha256.update(numToUint8Array(0)).digest());
    const initial_leaf = sha256.update(initial_commitment.array());

    let root = initial_leaf.update(hashPath);
    let spendLimit = 0;
    await response.waitForEnd();
    const bufferSize = response.bufferSize();
    var transactionList = [];
    for await (const content of response.contentStream()) {
      if (transactionList.length == bufferSize) {
        break;
      }

      content?.notes?.map((note) => {
        if(note.memo == userIdCommitment.slice(2, 34)) {
          transactionList.push(content);
        }
      })
    }

    let content;
    
    let transferAmount = 0;
    for (let i = transactionList.length - 1; i >= 0; i--) {
      content = transactionList[i];

      transferAmount = (parseInt(content?.assetBalanceDeltas[0]?.delta) * 10**(9 + 4) )/ 10 ** 8; //IRON decimals in gwei + 4 decimal price precision
      if (content?.type == "receive") {
        spendLimit += transferAmount;
      } else if (content?.type == "send") {
        spendLimit -= transferAmount;
      }
      let commitment = sha256.update(`0x${content?.hash}`);
      commitment = commitment.update(sha256.update(numToUint8Array(transferAmount)).digest());
      commitment = commitment.update(sha256.update(numToUint8Array(spendLimit)).digest());
      const leaf = sha256.update(commitment.array());
      hashPath = root.array();
      root = leaf.update(hashPath);
    }

    const relayInput = {
      index: 0,
      amountToSpend: amountToSpend,
      asset: assetAddress,
      assetPriceIRON: assetPriceIron,
      assetType: assetType,
      fee: fee,
      feePriceIRON: feePriceIron,
      hash_path: [hashPath],
      spend_limit: spendLimit,
      transferAmount: transferAmount,
      transactionHash: `0x${content?.hash?content.hash:"0000000000000000000000000000000000000000000000000000000000000000"}`,
      root: root.digest(),
    };

    const relayProof = await relay.generateFinalProof(relayInput);
    const relayProofHex = "0x" + Buffer.from(relayProof.proof).toString('hex')
    let relayPublicInputArray = []
    relayProof.publicInputs.forEach((v) => relayPublicInputArray.push(v))
    return { relayProof: {proof: relayProofHex, publicInputs: relayPublicInputArray} };
  } catch (e) {
    throw new Error(e)
  }
}

async function getSpendLimit(memo) {
  
  try {
    const sdk = await IronfishSdk.init({ dataDir: "~/.ironfish" });
    const options = {
      account: process.env.RELAY_BOT_IRONFISH_ACCOUNT,
      confirmations: 1,
      notes: true,
    };

    const client = await sdk.connectRpc();
    const response = client.wallet.getAccountTransactionsStream(options);

    await response.waitForEnd();
    const bufferSize = response.bufferSize();
    let transactionList = [];

    for await (const content of response.contentStream()) {
      if (transactionList.length == bufferSize) {
        break;
      }

      content?.notes?.map((note) => {
        if (note.memo == memo.slice(0, 32)) {
          transactionList.push(content);
        }
      });
    }

    console.log(transactionList)

    let content;
    let spendLimit = 0;

    let transferAmount = 0;
    for (let i = transactionList.length - 1; i >= 0; i--) {
      content = transactionList[i];

      transferAmount = parseInt(content?.assetBalanceDeltas[0]?.delta) / 10 ** 8; //scaling down decimals
      if (content?.type == "receive") {
        spendLimit += transferAmount;
      } else if (content?.type == "send") {
        spendLimit -= transferAmount;
      }
    }

    return spendLimit;
  } catch (e) {
    return new Error(e);
  }
}


function numToUint8Array(num) {
  const arr = new Uint8Array(8);

  for (let i = 0; i < 8; i++) {
    arr[i] = num % 256;
    num = Math.floor(num / 256);
  }

  return arr;
}

export { createRawTransaction, transactionProofs, getSpendLimit };
