import { RelayProof } from "./_components";
import { NextPage } from "next";

const Proofs: NextPage = () => {
  return (
    <>
      <RelayProof />
      {/* <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Generate proofs</h1>
        <p className="text-neutral">
          You can generate the user proofs and relay proofs and relay bot will return IPFS file link containing all the
          proofs which you can use when relaying transactions.
        </p>
      </div> */}
    </>
  );
};

export default Proofs;
