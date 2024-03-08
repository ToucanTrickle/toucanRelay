import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export const ProofData = ({
  proofDetails,
}: {
  proofDetails: {
    userProof: string;
    userPublicInputs: string;
    relayProof: string;
    relayPublicInputs: string;
    ipfsHash: string;
    toAddress: string;
  };
}) => {
  const [userProofCopied, setUserProofCopied] = useState(false);
  const [userPublicInputsCopied, setUserPublicInputsCopied] = useState(false);
  const [relayProofCopied, setRelayProofCopied] = useState(false);
  const [relayPublicInputsCopied, setRelayPublicInputsCopied] = useState(false);
  const [ipfsHashCopied, setIpfsHashCopied] = useState(false);
  const [messageCopied, setMessageCopied] = useState(false);

  const userProofCopyButton = (
    <div className="mt-1 pl-2">
      {userProofCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text={proofDetails.userProof as string}
          onCopy={() => {
            setUserProofCopied(true);
            setTimeout(() => {
              setUserProofCopied(false);
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

  const userPublicInputsCopyButton = (
    <div className="mt-1 pl-2">
      {userPublicInputsCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text={proofDetails.userPublicInputs}
          onCopy={() => {
            setUserPublicInputsCopied(true);
            setTimeout(() => {
              setUserPublicInputsCopied(false);
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

  const relayProofCopyButton = (
    <div className="mt-1 pl-2">
      {relayProofCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text={proofDetails.relayProof}
          onCopy={() => {
            setRelayProofCopied(true);
            setTimeout(() => {
              setRelayProofCopied(false);
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

  const relayPublicInputsCopyButton = (
    <div className="mt-1 pl-2">
      {relayPublicInputsCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text={proofDetails.relayPublicInputs}
          onCopy={() => {
            setRelayPublicInputsCopied(true);
            setTimeout(() => {
              setRelayPublicInputsCopied(false);
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

  const ipfsHashCopyButton = (
    <div className="mt-1 pl-2">
      {ipfsHashCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text={proofDetails.ipfsHash}
          onCopy={() => {
            setIpfsHashCopied(true);
            setTimeout(() => {
              setIpfsHashCopied(false);
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

  const messageCopyButton = (
    <div className="mt-1 pl-2">
      {messageCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text="\bot relay ${proofDetails.ipfsHash}"
          onCopy={() => {
            setMessageCopied(true);
            setTimeout(() => {
              setMessageCopied(false);
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
    <div className="flex text-sm rounded-3xl peer-checked:rounded-b-none min-h-0 bg-primary py-0 mt-3">
      <div className="flex-wrap collapse collapse-arrow">
        <input type="checkbox" className="min-h-0 peer" />

        <div className="collapse-title text-sm min-h-0 py-1.5 pl-4">
          <strong>Show Proof Details</strong>
        </div>

        <div className="collapse-content overflow-auto bg-secondary rounded-t-none rounded-3xl">
          <div className="flex pt-4">
            {userProofCopyButton}
            <pre className="mt-1">User proof: {proofDetails.userProof}</pre>
          </div>
          <div className="flex pt-4">
            {userPublicInputsCopyButton}
            <pre className="mt-1">User public inputs: {proofDetails.userPublicInputs}</pre>
          </div>
          <div className="flex pt-4">
            {relayProofCopyButton}
            <pre className="mt-1">Relay proof: {proofDetails.relayProof}</pre>
          </div>
          <div className="flex pt-4">
            {relayPublicInputsCopyButton}
            <pre className="mt-1">Relay public inputs: {proofDetails.relayPublicInputs}</pre>
          </div>
          <div className="flex pt-4">
            {ipfsHashCopyButton}
            <pre className="mt-1">IPFS hash: {proofDetails.ipfsHash}</pre>
          </div>
          <div className="pt-4">Copy this text and message to the relay bot.</div>
          <div className="flex pt-2">
            {messageCopyButton}{" "}
            <pre className="mt-1">
              \bot send {proofDetails.ipfsHash} {proofDetails.toAddress}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
