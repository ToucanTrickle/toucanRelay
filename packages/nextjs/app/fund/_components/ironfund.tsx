"use client";

import { useState } from "react";
import { InputBase } from "~~/components/scaffold-eth";

export const Ironfund = () => {
  const [assetAmount, setAssetAmount] = useState<string | bigint>("");
  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      <div className="container mx-auto flex flex-col">
        <h2 className="text-3xl font-bold mb-4 text-center text-primary-content">Fund $IRON to relay bot</h2>
        <div className="px-6 lg:px-10 w-full">
          <div className=" bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4">
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
              <div className="flex">
                <span className="font-bold">ToucanRelay deposit address:</span>
                <span className="font-medium my-0 px-5 break-words">
                  {process.env.NEXT_PUBLIC_RELAY_BOT_IRONFISH_ADDRESS}
                </span>
              </div>
              <div className="flex">
                <span className="font-bold">
                  Memo (*imp: memo has to be added to transaction for it to be indexed by bot):
                </span>
                <span className="font-medium my-0 px-5 break-words">
                  Semaphore Id Commitment + previous tx hash + current spend limit
                </span>
              </div>
              <div className="flex">
                <span className="font-bold">Current Spend Limit:</span>
                <span className="font-medium my-0 px-5 break-words">60</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
              <p className="font-medium my-0 break-words">Increase spend limit</p>
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center ml-2">
                  <span className="text-xs font-medium mr-2 leading-none">transfer amount</span>
                  <span className="block text-xs font-extralight leading-none">
                    string (enter amount in the lowest decimal units)
                  </span>
                </div>
                <InputBase name="assetAmount" placeholder="$IRON" value={assetAmount} onChange={setAssetAmount} />
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
                  Generate serialized transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
