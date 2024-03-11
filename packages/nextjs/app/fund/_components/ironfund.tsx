"use client";

import { useCallback, useEffect, useState } from "react";
import { SerializedTx } from "./serializedTx";
import { TxDetails } from "./txDetails";
import { Identity } from "@semaphore-protocol/identity";
import { InputBase } from "~~/components/scaffold-eth";

// import { TxReceipt } from "~~/app/debug/_components/contract";

export const Ironfund = () => {
  const [assetAmount, setAssetAmount] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [result, setResult] = useState<string | undefined>();
  const relayIronfishAddress = String(process.env.NEXT_PUBLIC_RELAY_BOT_IRONFISH_ADDRESS);
  const [commitment, setCommitment] = useState<string>();
  const [isFetching, setIsFetching] = useState(false);
  const [serializationErrored, setSerializationErrored] = useState(false);
  const [spendLimit, setSpendLimit] = useState(0);

  useEffect(() => {
    const identityString = localStorage.getItem("identity");
    async function getSpendLimit(commitment: string) {
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
      setSpendLimit(spendLimitData.spendlimit);
    }

    if (identityString) {
      const identity = new Identity(String(identityString));
      setCommitment(identity.commitment.toString(16));
      getSpendLimit(identity.commitment.toString(16));
    }
  }, []);

  const createIdentity = useCallback(async () => {
    const identity = new Identity();

    setCommitment(identity.commitment.toString(16));

    localStorage.setItem("identity", identity.toString());
  }, []);

  const generateSerializedTransaction = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_IRONFISH_DATA_URL}/getRawTransaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          from: accountName,
          to: relayIronfishAddress,
          amount: assetAmount,
          memo: commitment?.slice(0, 32),
        }),
      });

      if (response.status == 200) {
        const data = await response.json();

        setResult(data.transaction);
        setSerializationErrored(false);
        setIsFetching(false);
      } else {
        throw new Error("unable to generate relay proof!");
      }
    } catch (e) {
      setSerializationErrored(true);
      setIsFetching(false);
    }
  }, [accountName, assetAmount, commitment, relayIronfishAddress]);

  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      <div className="container mx-auto flex flex-col">
        <h2 className="text-3xl font-bold mb-4 text-center text-primary-content">Fund $IRON to relay bot</h2>
        <div className="px-6 lg:px-10 w-full">
          <div className=" bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4">
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
              <div className="flex">
                <span className="font-bold">ToucanRelay deposit address:</span>
                <span className="font-medium my-0 px-5 break-words">{relayIronfishAddress}</span>
              </div>
              <div className="flex">
                <span className="font-bold">
                  Memo (*imp: memo has to be added to transaction for it to be indexed by bot):
                </span>
                {commitment ? (
                  <span className="font-medium my-0 px-5 break-words">{commitment.slice(0, 32)}</span>
                ) : (
                  <button
                    className="mx-5 btn btn-secondary btn-sm"
                    onClick={async () => {
                      createIdentity();
                    }}
                  >
                    Generate New Identity
                  </button>
                )}
              </div>
              <div className="flex">
                <span className="font-bold">Spend Limit:</span>
                <span className="font-medium my-0 px-5 break-words">{spendLimit} IRON</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
              <p className="font-medium my-0 break-words">Increase spend limit</p>
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center ml-2">
                  <span className="text-xs font-medium mr-2 leading-none">transfer amount</span>
                  <span className="block text-xs font-extralight leading-none">(in gwei)</span>
                </div>
                <InputBase name="assetAmount" placeholder="$IRON" value={assetAmount} onChange={setAssetAmount} />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center ml-2">
                  <span className="text-xs font-medium mr-2 leading-none">Account name</span>
                  <span className="block text-xs font-extralight leading-none">string</span>
                </div>
                <InputBase name="accountName" value={accountName} onChange={setAccountName} />
              </div>
              <div className="flex justify-between gap-2 flex-wrap">
                <div className="flex-grow w-4/5">
                  {result !== null && result !== undefined ? <SerializedTx serializedTx={result} /> : null}
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={async () => {
                    // const { data } = await refetch();
                    await generateSerializedTransaction();
                  }}
                  disabled={isFetching}
                >
                  {isFetching && <span className="loading loading-spinner loading-xs"></span>}
                  {!serializationErrored
                    ? "Generate serialized transaction"
                    : "Unable to generate serialized transaction! Check inputs and try again."}
                </button>
              </div>
              <div className="flex justify-center gap-2 flex-wrap">OR</div>
              <div className="flex justify-between gap-2 flex-wrap">
                <TxDetails
                  txDetails={{ memo: commitment?.slice(0, 32), amount: assetAmount, to: relayIronfishAddress }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
