"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import litInstance from "~~/utils/custom/lit";

const Library: NextPage = () => {
  const [decryuptedBook, setDecryptedBook] = useState<File | null>(null);
  // Read the balanceOf for current address and if true show the comic book
  const { address: connectedAddress } = useAccount();
  console.log("📚 account", connectedAddress);
  const { data: balanceOf } = useScaffoldContractRead({
    contractName: "ComicBook",
    functionName: "balanceOf",
    args: [connectedAddress],
  });
  const bookCount = Number(balanceOf);

  console.log("📚 balanceOf", balanceOf);

  const openComicBook = () => {
    console.log("Open comic book");
  };

  useEffect(() => {
    litInstance.getAuthSig();
  }, []);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        {bookCount > 0 ? (
          <div className="flex flex-col space-y-4">
            <Image src="/first_page_transparent.png" alt="Comic Book" width={300} height={500} />
            <span className="text-2xl mx-auto">{bookCount} comic books</span>
            <button className="btn btn-primary w-32 mx-auto" onClick={openComicBook}>
              Read
            </button>
          </div>
        ) : (
          <div>No Comic books</div>
        )}
      </div>
    </>
  );
};

export default Library;
