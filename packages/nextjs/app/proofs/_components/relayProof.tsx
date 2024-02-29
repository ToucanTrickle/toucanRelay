"use client";

import { useState } from "react";
import { InputBase } from "~~/components/scaffold-eth";
import { AddressInput } from "~~/components/scaffold-eth";

export const RelayProof = () => {
  const [nullifier, setNullifier] = useState<string>();
  const [trapdoor, setTrapdoor] = useState<string>();
  const [commitment, setCommitment] = useState<string>();
  const [assetAddress, setAssetAddress] = useState("");
  const [assetAmount, setAssetAmount] = useState<string | bigint>("");
  const [toAddress, setToAddress] = useState<string>("");

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
                  // onClick={async () => {
                  //   const { data } = await refetch();
                  //   setResult(data);
                  // }}
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
                {/* {result !== null && result !== undefined && (
                  <div className="bg-secondary rounded-3xl text-sm px-4 py-1.5 break-words">
                    <p className="font-bold m-0 mb-1">Result:</p>
                    <pre className="whitespace-pre-wrap break-words">{displayTxResult(result)}</pre>
                  </div>
                )} */}
              </div>
              <button
                className="btn btn-secondary btn-sm"
                // onClick={async () => {
                //   const { data } = await refetch();
                //   setResult(data);
                // }}
                // disabled={isFetching}
              >
                {/* {isFetching && <span className="loading loading-spinner loading-xs"></span>} */}
                Get Spend Limit
              </button>
            </div>
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
              <p className="font-medium my-0 break-words">Enter Asset Details</p>
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center ml-2">
                  <span className="text-xs font-medium mr-2 leading-none">address</span>
                  <span className="block text-xs font-extralight leading-none">string</span>
                </div>
                <AddressInput onChange={setAssetAddress} value={assetAddress} placeholder="Input asset address" />
              </div>
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
                    string (enter amount in the lowest decimal units)
                  </span>
                </div>
                <InputBase name="assetAmount" placeholder="assetAmount" value={assetAmount} onChange={setAssetAmount} />
              </div>
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              <button
                className="btn btn-primary"
                // onClick={async () => {
                //   const { data } = await refetch();
                //   setResult(data);
                // }}
                // disabled={isFetching}
              >
                {/* {isFetching && <span className="loading loading-spinner loading-xs"></span>} */}
                Generate Proof
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
