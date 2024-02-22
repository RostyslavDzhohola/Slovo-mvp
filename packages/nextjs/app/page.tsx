"use client";

// import Link from "next/link";
import type { NextPage } from "next";
import litInstance from "~~/utils/custom/lit";

// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  const connectToLit = async () => {
    await litInstance.connect();
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <button className="btn btn-primary w-32 mx-auto" onClick={connectToLit}>
          Connect to Lit
        </button>
      </div>
    </>
  );
};

export default Home;
