"use client";

import Image from "next/image";
import type { NextPage } from "next";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Purchase: NextPage = () => {
  const { writeAsync: purchase, isMining } = useScaffoldContractWrite({
    contractName: "ComicBook",
    functionName: "safeMint",
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex flex-col space-y-4">
          <Image src="/first_page_transparent.png" alt="Comic Book" width={300} height={500} />
          <button className="btn btn-primary w-32 mx-auto" onClick={() => purchase()} disabled={isMining}>
            Buy Comic
          </button>
        </div>
      </div>
    </>
  );
};

export default Purchase;
