"use client";

import { useCallback, useEffect, useState } from "react";
import { Abi, createPublicClient, createWalletClient, custom, getContract, http } from "viem";
import { PublicClient, WalletClient } from "wagmi";
import { InputBase } from "~~/components/scaffold-eth";
import { chainAssetDetails, chainAssets, chainNames, chainRPCDetails } from "~~/constants/constants";
import deployedContracts from "~~/contracts/deployedContracts";

export const DepositPage = () => {
  const [selectedChain, setSelectedChain] = useState<string>(chainNames[0]);
  const [selectedAsset, setSelectedAsset] = useState<string>(chainAssets[chainNames[0]][0]);
  const [assetAmount, setAssetAmount] = useState<string | bigint>("");
  const [depositing, setDepositing] = useState(false);
  const [isTransactionErrored, setIsTransactionErrored] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [walletClient, setWalletClient] = useState<any>();
  // const [publicClient, setPublicClient] = useState<PublicClient>();
  const [wIRONBalance, setWIRONBalance] = useState<bigint>(0n);
  const [fetchingwIRON, setFetchingWIRON] = useState(false);
  const [isFetchErrored, setIsFetchErrored] = useState(false);

  useEffect(() => {
    setWalletClient(
      createWalletClient({
        chain: chainRPCDetails[chainNames[0]],
        transport: custom(window.ethereum as any),
      }),
    );
  }, []);

  const depositAsset = useCallback(async () => {
    setDepositing(true);
    const [account] = await walletClient.getAddresses();

    const publicClient = createPublicClient({
      chain: chainRPCDetails[selectedChain],
      transport: http(),
    });

    const relayVaultAddress =
      deployedContracts[[chainRPCDetails[selectedChain].id] as unknown as keyof typeof deployedContracts].RelayVault
        .address;

    try {
      if (chainAssetDetails[selectedChain + " | " + selectedAsset].type == "2") {
        const tokenContractData = getContract({
          abi: [
            {
              constant: false,
              inputs: [
                {
                  name: "_spender",
                  type: "address",
                },
                {
                  name: "_value",
                  type: "uint256",
                },
              ],
              name: "approve",
              outputs: [
                {
                  name: "",
                  type: "bool",
                },
              ],
              payable: false,
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              constant: true,
              inputs: [
                {
                  name: "_owner",
                  type: "address",
                },
                {
                  name: "_spender",
                  type: "address",
                },
              ],
              name: "allowance",
              outputs: [
                {
                  name: "",
                  type: "uint256",
                },
              ],
              payable: false,
              stateMutability: "view",
              type: "function",
            },
          ] as unknown as Abi,
          address: chainAssetDetails[selectedChain + " | " + selectedAsset].address,
          walletClient: walletClient as WalletClient,
          publicClient,
        });

        const relayContractData = getContract({
          abi: deployedContracts[[chainRPCDetails[selectedChain].id] as unknown as keyof typeof deployedContracts]
            .RelayVault.abi,
          address:
            deployedContracts[[chainRPCDetails[selectedChain].id] as unknown as keyof typeof deployedContracts]
              .RelayVault.address,
          walletClient: walletClient as WalletClient,
        });

        const allowance = await tokenContractData.read.allowance([account, relayVaultAddress]);

        if (
          (allowance as bigint) <
          BigInt(assetAmount) * 10n ** BigInt(chainAssetDetails[selectedChain + " | " + selectedAsset].decimals)
        ) {
          await tokenContractData.write.approve(
            [
              relayVaultAddress,
              BigInt(assetAmount) * 10n ** BigInt(chainAssetDetails[selectedChain + " | " + selectedAsset].decimals),
            ],
            { account: account },
          );
        }

        const tx = await relayContractData.write.deposit(
          [
            chainAssetDetails[selectedChain + " | " + selectedAsset].address,
            BigInt(assetAmount) * 10n ** BigInt(chainAssetDetails[selectedChain + " | " + selectedAsset].decimals),
          ],
          { account: account, value: 0n },
        );
        setTxHash(tx);
      } else {
        const transactionRequest = await walletClient.prepareTransactionRequest({
          account,
          to: relayVaultAddress,
          value: BigInt(assetAmount) * 10n ** 9n,
          maxFeePerGas: 150000000000n,
          maxPriorityFeePerGas: 1000000000n,
        });

        const signature = await walletClient.sendTransaction(transactionRequest);

        setTxHash(signature);
      }
      setDepositing(false);
      setIsTransactionErrored(false);
    } catch (e) {
      setDepositing(false);
      setIsTransactionErrored(true);
    }
  }, [assetAmount, selectedAsset, selectedChain, walletClient]);

  const wIRONSupply = useCallback(async () => {
    setFetchingWIRON(true);

    try {
      const publicClient = createPublicClient({
        chain: chainRPCDetails[selectedChain],
        transport: http(),
      });

      const wIRONContract = getContract({
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ] as unknown as Abi,
        address:
          deployedContracts[[chainRPCDetails[selectedChain].id] as unknown as keyof typeof deployedContracts].WIRON
            .address,
        walletClient: walletClient as WalletClient,
        publicClient: publicClient as PublicClient,
      });

      const wironBalance = await wIRONContract.read?.balanceOf([
        deployedContracts[[chainRPCDetails[selectedChain].id] as unknown as keyof typeof deployedContracts].RelayVault
          .address,
      ]);
      setWIRONBalance(wironBalance as bigint);
      setFetchingWIRON(false);
      setIsFetchErrored(false);
    } catch (e) {
      setFetchingWIRON(false);
      setIsFetchErrored(true);
    }
  }, [selectedChain, walletClient]);

  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      <div className="container mx-auto flex flex-col">
        <h2 className="text-3xl font-bold mb-4 text-center text-primary-content">Deposit Assets to get WIRON</h2>
        <div className="px-6 lg:px-10 w-full">
          <div className=" bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4">
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
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
              <p className="font-medium my-0 break-words">
                Current WIRON supply in vault: {(wIRONBalance / 10n ** 18n)?.toString()}
              </p>
              <button className={`btn btn-secondary btn-sm font-light hover:border-transparent`} onClick={wIRONSupply}>
                {fetchingwIRON && <span className="loading loading-spinner loading-xs"></span>}
                {isFetchErrored ? "Unable to fetch wIRON supply" : "Fetch"}
              </button>
              <p className="font-small my-0 break-words">
                Note: The deposit might fail if the supply of wIRON in vault is insufficient to compensate for the token
                amount.
              </p>
            </div>
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
              <p className="font-medium my-0 break-words">Enter Transfer Details</p>

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
            {txHash ? (
              <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
                <p className="font-medium my-0 break-words">Transaction Successful!</p>
                <div className="flex">
                  <span className="font-bold">Transaction hash:</span>
                  <span className="font-medium my-0 px-5 break-words">{txHash}</span>
                </div>
              </div>
            ) : null}
            <div className="flex justify-center gap-2 flex-wrap">
              <button
                className="btn btn-primary"
                onClick={async () => {
                  await depositAsset();
                }}
                disabled={depositing}
              >
                {depositing && <span className="loading loading-spinner loading-xs"></span>}
                {!isTransactionErrored ? "Deposit Asset" : "Transaction failed, check inputs, balances and try again!"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
