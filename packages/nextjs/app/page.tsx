import Link from "next/link";
import type { NextPage } from "next";
import { ArrowsRightLeftIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">ToucanRelay Bot</span>
          </h1>
          <p className="text-center text-lg">
            ToucanRelay Bot is a user-friendly transaction relay bot that any crypto newbie can use to transfer crypto
            to any wallet account anonymously.
          </p>
          <p className="text-lg">In order to use this bot :-</p>
          <p className="text-lg">
            1. Anonymously fund bot using privacy preserved network (currently supports Ironfish)
          </p>
          <p className="text-lg">2. Generate funding proofs and copy the relay message generated</p>
          <p className="text-lg">
            3. Head over to relay bot (currently active in discord) and message it to relay transaction.
          </p>
          <p className="text-lg">
            4. (Optional) Deposit assets in relay bot smart contract in exchange for wIRON tokens.
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              {/* <BugAntIcon className="h-8 w-8 fill-secondary" /> */}
              <EyeSlashIcon className="h-8 w-8 fill-secondary" />
              <p>
                Anonymously relay transactions with{" "}
                <Link href="/fund" passHref className="link">
                  Relay Transactions
                </Link>{" "}
                tab.
              </p>
            </div>
            {/* <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <ChatBubbleBottomCenterTextIcon className="h-8 w-8 fill-secondary" />
              <p>
                Generate Relay Message with{" "}
                <Link href="/proofs" passHref className="link">
                  Generate Relay Proof
                </Link>{" "}
                tab.
              </p>
            </div> */}
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <ArrowsRightLeftIcon className="h-8 w-8 fill-secondary" />
              <p>
                Swap Assets with wIRON with{" "}
                <Link href="/deposit" passHref className="link">
                  Deposit Assets
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
