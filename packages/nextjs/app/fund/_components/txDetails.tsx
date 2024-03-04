import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export const TxDetails = ({ txDetails }: { txDetails: { memo: string | undefined; amount: string; to: string } }) => {
  const [toAddressCopied, setToAddressCopied] = useState(false);
  const [memoCopied, setMemoCopied] = useState(false);
  const [amountCopied, setAmountCopied] = useState(false);

  const toAddressCopyButton = (
    <div className="mt-1 pl-2">
      {toAddressCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text={txDetails.to as string}
          onCopy={() => {
            setToAddressCopied(true);
            setTimeout(() => {
              setToAddressCopied(false);
            }, 800);
          }}
        >
          <DocumentDuplicateIcon
            className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
            aria-hidden="true"
          />
        </CopyToClipboard>
      )}
    </div>
  );

  const memoCopyButton = (
    <div className="mt-1 pl-2">
      {memoCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text={txDetails.memo as string}
          onCopy={() => {
            setMemoCopied(true);
            setTimeout(() => {
              setMemoCopied(false);
            }, 800);
          }}
        >
          <DocumentDuplicateIcon
            className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
            aria-hidden="true"
          />
        </CopyToClipboard>
      )}
    </div>
  );

  const amountCopyButton = (
    <div className="mt-1 pl-2">
      {amountCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text={txDetails.amount}
          onCopy={() => {
            setAmountCopied(true);
            setTimeout(() => {
              setAmountCopied(false);
            }, 800);
          }}
        >
          <DocumentDuplicateIcon
            className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
            aria-hidden="true"
          />
        </CopyToClipboard>
      )}
    </div>
  );
  return (
    <div className="flex text-sm rounded-3xl peer-checked:rounded-b-none min-h-0 bg-secondary py-0">
      <div className="flex-wrap collapse collapse-arrow">
        <input type="checkbox" className="min-h-0 peer" />

        <div className="collapse-title text-sm min-h-0 py-1.5 pl-4">
          <strong>Send funds using Fox Wallet with the following details</strong>
        </div>

        <div className="collapse-content overflow-auto bg-secondary rounded-t-none rounded-3xl">
          <div className="flex pt-4">
            <pre className="mt-1">To Address: {txDetails.to}</pre>
            {toAddressCopyButton}
          </div>
          <div className="flex pt-4">
            <pre className="mt-1">Memo: {txDetails.memo}</pre>
            {memoCopyButton}
          </div>
          <div className="flex pt-4">
            <pre className="mt-1">Amount: {txDetails.amount}</pre>
            {amountCopyButton}
          </div>
        </div>
      </div>
    </div>
  );
};
