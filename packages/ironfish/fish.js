import relaycircuit from "../circuits/relay_circuit/target/relay_circuit.json" assert { type: "json" };
import abi from './abi/WIron.js';
import { CurrencyUtils, IronfishSdk } from "@ironfish/sdk";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import {Contract, ethers} from "ethers";
import pkg from 'js-sha256';
const { Message, sha256 } = pkg;

async function createRawTransaction(from, to, amount, memo) {
  const sdk = await IronfishSdk.init({ dataDir: "~/.ironfish" });
  const client = await sdk.connectRpc();

  const fee = 1n;
  const confirmations = 1;
  const options = {
    account: from,
    outputs: [
      {
        publicAddress: to,
        amount: CurrencyUtils.encode(amount),
        memo: memo,
      },
    ],
    fee: CurrencyUtils.encode(fee),
    confirmations,
  };

  const response = await client.wallet.createTransaction(options);
  return response.content;
}

async function transactionProofs(
  userIdCommitment,
  amountToSpend,
  assetPriceIron,
  assetType,
  fee,
  feePriceIron,
  assetAddress,
) {
  try {
    const relayBackend = new BarretenbergBackend(relaycircuit);
    const relay = new Noir(relaycircuit, relayBackend);
    
    let hashPath = sha256.update(new Uint8Array([0, 0, 0])).array();
    let initial_commitment = sha256.update(`0x0000000000000000000000000000000000000000000000000000000000000000`);
    initial_commitment = initial_commitment.update(sha256.update(numToUint8Array(0)).digest());
    initial_commitment = initial_commitment.update(sha256.update(numToUint8Array(0)).digest());
    const initial_leaf = sha256.update(initial_commitment.array());

    let root = initial_leaf.update(hashPath);
    let spendLimit = 0;
    const transactionList = await getTransactionList(userIdCommitment.slice(2))

    let content;
    for (let i = 0; i < transactionList.length; i++) {
      content = transactionList[i];

      // transferAmount = (parseInt(content?.value) * 10**(5) ); //IRON decimals in gwei + 4 decimal price precision - 8 decimals
      if (content?.type == "receive") {
        spendLimit += content?.value;
      } else if (content?.type == "send") {
        spendLimit -= content?.value;
      }
      let commitment = sha256.update(content?.hash);
      commitment = commitment.update(sha256.update(numToUint8Array(content?.value)).digest());
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
      transferAmount: content?.value,
      transactionHash: `${content?.hash?content.hash:"0x0000000000000000000000000000000000000000000000000000000000000000"}`,
      root: root.digest(),
    };

    const relayProof = await relay.generateFinalProof(relayInput);
    const relayProofHex = "0x" + Buffer.from(relayProof.proof).toString('hex')
    let relayPublicInputArray = []
    relayProof.publicInputs.forEach((v) => relayPublicInputArray.push(v))
    return { relayProof: {proof: relayProofHex, publicInputs: relayPublicInputArray} };
  } catch (e) {
    console.log(e)
    throw new Error(e)
  }
}

async function getSpendLimit(memo) {
  
  try {
    const transactionList = await getTransactionList(memo)

    console.log(transactionList)

    let content;
    let spendLimit = 0;

    for (let i = 0; i < transactionList.length; i++) {
      content = transactionList[i];

      if (content?.type == "receive") {
        spendLimit += content.value;
      } else if (content?.type == "send") {
        spendLimit -= content.value;
      }
    }

    return spendLimit/10**13;
  } catch (e) {
    console.log(e)
    return 0;
  }
}

async function getTransactionList(memo) {
  let transactionList = [];
  try {
    const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc")
    const contract = new Contract(process.env.RELAY_BOT_ARBITRUM_SEPOLIA_CONTRACT, [{
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "memo",
          "type": "string"
        }
      ],
      "name": "Relay",
      "type": "event"
    }], provider);

    

    const eventDetails = (await contract.queryFilter("Relay")).filter((e) => (e.topics[1] == ethers.keccak256(Buffer.from(memo.slice(0, 32)))));
    
    await Promise.all(eventDetails.map(async (event) => {
      const block = await provider.getBlock(event.blockNumber);
      const transactionReceipt = await provider.getTransactionReceipt(event.transactionHash)
      const transactionEvent = transactionReceipt.logs;
      const tokenContract = new Contract(transactionEvent[0].address, [{
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      }, {
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }, {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }], provider)
      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();
      
      const cmcResp = await fetch(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=IRON,ETH,${
          symbol
        }`,
        {
          method: "GET",
          headers: {
            "X-CMC_PRO_API_KEY": String(process.env.CMC_API_KEY),
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Content-Type": "application/json",
          },
        },
      );
      const cmcData = await cmcResp.json();
      const assetPriceIRON = `${parseInt(
        String(
          (cmcData.data[symbol].quote.USD.price /
            cmcData.data.IRON.quote.USD.price) *
            10000,
        ),
      )}`;

      transactionList.push({
        type: "send",
        value: parseInt((transactionEvent[0].data/10**parseInt(decimals)) * assetPriceIRON * 10**9), // need to convert to the IRON equivalent based on price
        timestamp: block.timestamp * 1000, //in microseconds
        chain: "evm",
        index: transactionEvent[0].index,
        hash: transactionEvent[0].transactionHash
      })
    }));

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
    
    let totalReceived = 0;
    for await (const content of response.contentStream()) {
      totalReceived += 1
      if (totalReceived == bufferSize) {
        break;
      }
      
      content?.notes?.map((note, idx) => {
        
        if (note.memo == memo.slice(0, 32)) {
          transactionList.push({
            type: content.type,
            value: parseInt(note?.value) * 10**(5), //IRON decimals in gwei + 4 decimal price precision - 8 decimals
            timestamp: content.timestamp,
            chain: "ironfish",
            index: idx,
            hash: `0x${note.transactionHash}`
          });
        }
      });
    }

    transactionList.sort((a, b) => {
      if (a.timestamp === b.timestamp){
        return a.index < b.index ? -1 : 1
      } else {
        return a.timestamp < b.timestamp ? -1 : 1
      }
    })
    return transactionList
  } catch(e) {
    console.log(e);
    return transactionList;
  }
}

async function checkAndUpdateSupply() {
  try {
    const sdk = await IronfishSdk.init({ dataDir: "~/.ironfish" });
    
    const client = await sdk.connectRpc();

    const {contract} = connectWIron();
    const totalSupply = await contract.totalSupply()
    console.log(totalSupply);

    const balance = await client.wallet.getAccountBalance({
      account: process.env.RELAY_BOT_IRONFISH_ACCOUNT,
      confirmations: 3,
    })



    if (BigInt(balance.content.available * (10**10)) > totalSupply) {
      const tx = await contract.mint(
        process.env.RELAY_BOT_ARBITRUM_SEPOLIA_CONTRACT,
        // TODO handle potential error here string -> bigint
        BigInt(balance.content.available * (10**10)) - totalSupply,
      );
      console.log(tx)
    }
  } catch(e) {
    console.log(e)
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

function connectWIron() {
  const wIronDeployerPrivateKey = process.env.RELAY_EVM_PRIVATE_KEY;
  const provider = new ethers.JsonRpcProvider(process.env.EVM_RPC_URL);
  const wallet = new ethers.Wallet(wIronDeployerPrivateKey, provider);
  const contract = new ethers.Contract(process.env.WIRON_CONTRACT_ADDRESS, abi, wallet)
  return { provider, contract };
}

export { createRawTransaction, transactionProofs, getSpendLimit, checkAndUpdateSupply };
