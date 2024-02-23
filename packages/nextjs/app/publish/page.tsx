"use client";

// import Link from "next/link";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import litInstance from "~~/utils/custom/lit";

// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Publish: NextPage = () => {
  const { data: deployedContractData } = useDeployedContractInfo("ComicBook");
  const [address, setAddress] = useState<string>("");
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [encryptedBookCid, setEncryptedBookCid] = useState<string>("this is a test cid");

  const { data: ipfsCid } = useScaffoldContractRead({
    contractName: "ComicBook",
    functionName: "getIpfsCid",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = e.target.files?.[0];
    if (file) {
      const mimeType = file.type;
      if (mimeType.startsWith("application/pdf")) {
        // Modify according to your valid mime types for books
        setBookFile(file);
      } else {
        setBookFile(null);
        fileInput.value = "";
        console.log("Invalid book file type.");
        alert("Invalid book file type. Please upload a PDF.");
        // Show some error message to the user if you like
      }
    }
  };

  const handleGetIpfsCid = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bookFile) {
      console.log("Book file is required");
      return;
    }
    if (!address) {
      console.log("Address is required");
      return;
    }
    try {
      const cid = await litInstance.encrypt(bookFile, address);
      setEncryptedBookCid(cid);
    } catch (error) {
      console.error("Failed to encrypt book:", error);
    }
  };

  const connectToLit = async () => {
    await litInstance.connect();
  };

  useEffect(() => {
    litInstance.getAuthSig();
  }, []);

  useEffect(() => {
    if (ipfsCid) {
      setEncryptedBookCid(ipfsCid);
    }
  }, [ipfsCid]);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <button className="btn btn-primary w-32 mx-auto" onClick={connectToLit}>
          Connect to Lit
        </button>
      </div>
      <form className="flex flex-col gap-4 mx-auto" onSubmit={handleGetIpfsCid}>
        <Address address={deployedContractData?.address} />
        <AddressInput onChange={setAddress} value={address} placeholder="Input your address" />
        <input
          type="file"
          placeholder="Upload the book file"
          className="input input-primary"
          onChange={handleFileChange}
        />
        <button className="btn btn-primary w-32 mx-auto" type="submit">
          Encrypt
        </button>
        <span className="text-center">{encryptedBookCid}</span>
      </form>
    </>
  );
};

export default Publish;
