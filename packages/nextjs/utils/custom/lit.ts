"use client ";

import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { AuthSig, ILitNodeClient, RejectedNodePromises } from "@lit-protocol/types";

const client = new LitJsSdk.LitNodeClient({
  litNetwork: "serrano",
});
const chain = "mumbai";
let authSig: AuthSig | undefined;

const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "ERC721",
    chain: chain,
    method: "balanceOf",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: ">",
      value: "0", // at least 1 NFT of the book
    },
  },
];

class Lit {
  async connect() {
    try {
      await client.connect();
      console.log("Connected to Lit");
    } catch (error) {
      console.error("Failed to connect to Lit:", error);
    }
  }

  async getAuthSig() {
    authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: chain });
    console.log("Auth sig:", authSig);
  }

  async encrypt(bookFile: File, bookAddress: string) {
    if (!client) {
      await this.connect();
    }

    if (!bookAddress) {
      console.log("Book address is required");
      throw new Error("Book address is required");
    }

    const updatedAccessControlConditions = {
      ...accessControlConditions, // Spread the existing properties
      contractAddress: bookAddress, // Override the contractAddress property
    };
    console.log("updatedAccessControlConditions are: ", updatedAccessControlConditions);

    if (!authSig) {
      await this.getAuthSig();
    }

    try {
      const ipfsCid = await LitJsSdk.encryptToIpfs({
        authSig,
        accessControlConditions: updatedAccessControlConditions,
        chain,
        // string: "test this string",
        file: bookFile,
        litNodeClient: client,
        infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || "",
        infuraSecretKey: process.env.NEXT_PUBLIC_INFURA_API_SECRET_KEY || "",
      });

      return ipfsCid;
    } catch (error) {
      console.error("Failed to encrypt:", error);
      throw error; // This will re-throw the error, whether it's an instance of Error or not
    }
  }

  async decrypt(ipfsCid: string) {
    if (!client) {
      await this.connect();
    }

    if (!authSig) {
      await this.getAuthSig();
    }

    try {
      const decryptedFile = await LitJsSdk.decryptFromIpfs({
        authSig: authSig,
        ipfsCid: ipfsCid,
        litNodeClient: client,
      });

      return decryptedFile;
    } catch (error) {
      console.error("Failed to decrypt:", error);
      throw error; // This will re-throw the error, whether it's an instance of Error or not
    }
  }
}
const litInstance = new Lit();
export default litInstance;
