"use client";

import { useCallback, useEffect, useState } from "react";
import { transactionProofs } from "../proofGenerator/ironfish";
import { ProofData } from "./proofData";
import { Identity } from "@semaphore-protocol/identity";
import { createPublicClient, getContract, http } from "viem";
import { useAccount } from "wagmi";
import { InputBase } from "~~/components/scaffold-eth";
import { AddressInput } from "~~/components/scaffold-eth";
import { chainAssetDetails, chainAssets, chainNames, chainRPCDetails } from "~~/constants/constants";
import deployedContracts from "~~/contracts/deployedContracts";

export const RelayProof = () => {
  const [nullifier, setNullifier] = useState<string>();
  const [trapdoor, setTrapdoor] = useState<string>();
  const [commitment, setCommitment] = useState<string>();
  const [assetAmount, setAssetAmount] = useState<string | bigint>("");
  const [toAddress, setToAddress] = useState<string>("");
  const [selectedChain, setSelectedChain] = useState<string>(chainNames[0]);
  const [selectedAsset, setSelectedAsset] = useState<string>(chainAssets[chainNames[0]][0]);
  const [spendLimit, setSpendLimit] = useState<number>();
  const [userProof, setUserProof] = useState<string>();
  const [userPublicInputs, setUserPublicInputs] = useState<string>();
  const [relayProof, setRelayProof] = useState<string>();
  const [relayPublicInputs, setRelayPublicInputs] = useState<string>();
  const [ipfsHash, setIpfsHash] = useState<string>();
  const [generating, setGenerating] = useState(false);
  const [isProofErrored, setIsProofErrored] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentSupply, setCurrentSupply] = useState(0);
  const [, setChainId] = useState<number>(1);

  const account = useAccount();
  const publicClient = createPublicClient({
    chain: chainRPCDetails[selectedChain],
    transport: http(),
  });

  const contractData = getContract({
    abi: deployedContracts[[chainRPCDetails[selectedChain].id] as unknown as keyof typeof deployedContracts].RelayVault
      .abi,
    address:
      deployedContracts[[chainRPCDetails[selectedChain].id] as unknown as keyof typeof deployedContracts].RelayVault
        .address,
    publicClient: publicClient,
  });

  useEffect(() => {
    const identityString = localStorage.getItem("identity");

    if (identityString) {
      const identity = new Identity(identityString);

      setNullifier(identity.nullifier.toString(16));
      setTrapdoor(identity.trapdoor.toString(16));
      setCommitment(identity.commitment.toString(16));
    }

    async function getSupply() {
      if (
        chainAssetDetails[selectedChain + " | " + selectedAsset].address != "0x0000000000000000000000000000000000000000"
      ) {
        const assetDetails = await contractData.read.assets([
          chainAssetDetails[selectedChain + " | " + selectedAsset].address,
        ]);
        console.log(assetDetails);
        setCurrentSupply(parseInt(assetDetails[3].toString()) / 10 ** assetDetails[1]);
      } else {
        const nativebalance = await publicClient.getBalance({
          address: contractData.address,
          blockTag: "latest",
        });
        setCurrentSupply(parseFloat((nativebalance / 10n ** 9n).toString()));
      }
    }

    getSupply();
  }, [contractData.address, contractData.read, publicClient, selectedAsset, selectedChain]);

  const createIdentity = useCallback(async () => {
    const identity = new Identity();

    setNullifier(identity.nullifier.toString(16));
    setTrapdoor(identity.trapdoor.toString(16));
    setCommitment(identity.commitment.toString(16));

    localStorage.setItem("identity", identity.toString());
  }, []);

  const generateProof = useCallback(async () => {
    try {
      setGenerating(true);

      const cmcResp = await fetch(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=IRON,ETH,${
          chainAssetDetails[selectedChain + " | " + selectedAsset].symbol
        }`,
        {
          method: "GET",
          headers: {
            "X-CMC_PRO_API_KEY": String(process.env.NEXT_PUBLIC_CMC_API_KEY),
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Content-Type": "application/json",
          },
        },
      );
      const cmcData = await cmcResp.json();
      const estimatedFees = await contractData.estimateGas.deposit(["0xb1D4538B4571d411F07960EF2838Ce337FE1E80E", 0n], {
        account: String(account.address),
      }); // for approx estimation of gas fees for calculation of relay proofs

      const assetAddress = `${chainAssetDetails[selectedChain + " | " + selectedAsset].address}`;
      const assetPriceIRON = `${parseInt(
        String(
          (cmcData.data[`${chainAssetDetails[selectedChain + " | " + selectedAsset].symbol}`].quote.USD.price /
            cmcData.data.IRON.quote.USD.price) *
            10000,
        ),
      )}`;
      const assetType = `${chainAssetDetails[selectedChain + " | " + selectedAsset].type}`;

      //Double the gas fees because more computations are involved in verifying relay proofs onchain
      const estFee = `${Number(estimatedFees) * 2}`;
      const fee = estFee;
      const feePriceIRON = `${parseInt(
        String((cmcData.data.ETH.quote.USD.price / cmcData.data.IRON.quote.USD.price) * 10000),
      )}`;
      const data = await transactionProofs(
        `0x${nullifier}`,
        `0x${trapdoor}`,
        `0x${commitment}`,
        `0x${assetType == "1" ? assetAmount.toString(16) : (BigInt(assetAmount) * 10n ** 9n).toString(16)}`,
        assetPriceIRON,
        assetType,
        fee,
        feePriceIRON,
        assetAddress,
      );

      setUserProof(data.userTxProof.proof);
      setUserPublicInputs(JSON.stringify({ publicInputs: data.userTxProof.publicInputs }));
      setRelayProof(data.relayTxProof.proof);
      setRelayPublicInputs(JSON.stringify({ publicInputs: data.relayTxProof.publicInputs }));

      const ipfsRes = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({
          userProof: data.userTxProof.proof,
          userPublicInputs: data.userTxProof.publicInputs,
          relayProof: data.relayTxProof.proof,
          relayPublicInputs: data.relayTxProof.publicInputs,
          chainId: chainRPCDetails[selectedChain].id,
          amount: (assetType == "1"
            ? BigInt(assetAmount) * 10n ** 9n
            : BigInt(assetAmount) * 10n ** BigInt(chainAssetDetails[selectedChain + " | " + selectedAsset].decimals)
          ).toString(),
          transferAsset: chainAssetDetails[selectedChain + " | " + selectedAsset].address,
          memo: commitment?.slice(0, 32),
        }),
      });
      const ipfsHash = await ipfsRes.text();

      setIpfsHash(JSON.parse(ipfsHash).IpfsHash);
      setGenerating(false);
      setIsProofErrored(false);
    } catch (e) {
      console.log(e);
      setGenerating(false);
      setIsProofErrored(true);
    }
  }, [
    selectedChain,
    selectedAsset,
    contractData.estimateGas,
    account.address,
    nullifier,
    trapdoor,
    commitment,
    assetAmount,
  ]);

  const getSpendLimit = useCallback(async () => {
    setIsFetching(true);
    const spendLimitResp = await fetch(`${process.env.NEXT_PUBLIC_IRONFISH_DATA_URL}/getSpendLimit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        commitment: commitment,
      }),
    });

    const spendLimitData = await spendLimitResp.json();
    setIsFetching(false);
    setSpendLimit(spendLimitData.spendlimit);
  }, [commitment, setSpendLimit]);

  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      <div className="container mx-auto flex flex-col">
        <h2 className="text-3xl font-bold mb-4 text-center text-primary-content">Generate Relay Proof</h2>
        <div className="px-6 lg:px-10 w-full">
          <div className=" bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4">
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
              <div className="flex justify-between gap-2 flex-wrap">
                <div className="flex-grow w-4/5">
                  <p className="font-medium my-0 break-words">Enter Your Identity</p>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={async () => {
                    createIdentity();
                  }}
                  // disabled={isFetching}
                >
                  {/* {isFetching && <span className="loading loading-spinner loading-xs"></span>} */}
                  Generate New
                </button>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center ml-2">
                  <span className="text-xs font-medium mr-2 leading-none">nullifier</span>
                  <span className="block text-xs font-extralight leading-none">string</span>
                </div>
                <InputBase name="nullifier" placeholder="nullifier" value={nullifier} onChange={setNullifier} />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center ml-2">
                  <span className="text-xs font-medium mr-2 leading-none">trapdoor</span>
                  <span className="block text-xs font-extralight leading-none">string</span>
                </div>
                <InputBase name="trapdoor" placeholder="trapdoor" value={trapdoor} onChange={setTrapdoor} />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center ml-2">
                  <span className="text-xs font-medium mr-2 leading-none">commitment</span>
                  <span className="block text-xs font-extralight leading-none">string</span>
                </div>
                <InputBase name="commitment" placeholder="commitment" value={commitment} onChange={setCommitment} />
              </div>
            </div>
            <div className="flex justify-between gap-2 flex-wrap">
              <div className="flex-grow w-4/5">
                {spendLimit !== null && spendLimit !== undefined && (
                  <div className="bg-secondary rounded-3xl text-sm px-4 py-1.5 break-words flex">
                    <p className="font-bold m-0 mb-1">Spend Limit:</p>
                    <pre className="whitespace-pre-wrap break-words">{spendLimit}</pre>
                  </div>
                )}
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={async () => {
                  getSpendLimit();
                }}
                disabled={isFetching}
              >
                {/* {isFetching && <span className="loading loading-spinner loading-xs"></span>} */}
                Get Spend Limit
              </button>
            </div>
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
              <p className="font-medium my-0 break-words">Select Chain</p>
              {chainNames.length === 0 ? (
                <p className="text-3xl mt-14">No chains found!</p>
              ) : (
                <>
                  {chainNames.length > 0 && (
                    <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
                      {chainNames.map(chainName => (
                        <button
                          className={`btn btn-secondary btn-sm font-light hover:border-transparent ${
                            chainName === selectedChain
                              ? "bg-base-300 hover:bg-base-300 no-animation"
                              : "bg-base-100 hover:bg-secondary"
                          }`}
                          key={chainName}
                          onClick={() => {
                            setSelectedChain(chainName);
                            setChainId(chainRPCDetails[selectedChain].id);
                          }}
                        >
                          {chainName}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
              <p className="font-medium my-0 break-words">Select Asset</p>
              {chainAssets[selectedChain].length === 0 ? (
                <p className="text-3xl mt-14">No assets found!</p>
              ) : (
                <>
                  {chainAssets[selectedChain].length > 1 && (
                    <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
                      {chainAssets[selectedChain].map(chainAsset => (
                        <button
                          className={`btn btn-secondary btn-sm font-light hover:border-transparent ${
                            chainAsset === selectedAsset
                              ? "bg-base-300 hover:bg-base-300 no-animation"
                              : "bg-base-100 hover:bg-secondary"
                          }`}
                          key={chainAsset}
                          onClick={() => setSelectedAsset(chainAsset)}
                        >
                          {chainAsset}
                        </button>
                      ))}
                      <div className="ml-5">
                        current supply = {currentSupply} in{" "}
                        {chainAssetDetails[selectedChain + " | " + selectedAsset].symbol == "ETH"
                          ? "GWEI"
                          : chainAssetDetails[selectedChain + " | " + selectedAsset].symbol}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
              <p className="font-medium my-0 break-words">Enter Transfer Details</p>
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center ml-2">
                  <span className="text-xs font-medium mr-2 leading-none">to address</span>
                  <span className="block text-xs font-extralight leading-none">string</span>
                </div>
                <AddressInput onChange={setToAddress} value={toAddress} placeholder="Input asset address" />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center ml-2">
                  <span className="text-xs font-medium mr-2 leading-none">asset amount</span>
                  <span className="block text-xs font-extralight leading-none">
                    string (
                    {selectedAsset == "ETH"
                      ? "in gwei"
                      : `in ${chainAssetDetails[selectedChain + " | " + selectedAsset].symbol}`}
                    )
                  </span>
                </div>
                <InputBase name="assetAmount" placeholder="assetAmount" value={assetAmount} onChange={setAssetAmount} />
              </div>
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              <button
                className="btn btn-primary"
                onClick={async () => {
                  await generateProof();
                }}
                disabled={generating}
              >
                {generating && <span className="loading loading-spinner loading-xs"></span>}
                {!isProofErrored ? "Generate Proof" : "Proof generation failed, check inputs and try again!"}
              </button>
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              {userProof && userPublicInputs && relayProof && relayPublicInputs && ipfsHash ? (
                <ProofData
                  proofDetails={{
                    userProof: userProof,
                    userPublicInputs: userPublicInputs,
                    relayProof: relayProof,
                    relayPublicInputs: relayPublicInputs,
                    ipfsHash: ipfsHash,
                    toAddress: toAddress,
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
