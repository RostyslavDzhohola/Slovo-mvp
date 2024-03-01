"use client ";

import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { AuthSig, ILitNodeClient } from "@lit-protocol/types";

const client = new LitJsSdk.LitNodeClient({
  litNetwork: "serrano",
}) as unknown as ILitNodeClient;
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
  /**
   * Connects to Lit.
   * @returns {Promise<void>} A promise that resolves when the connection is established.
   */
  async connect() {
    try {
      await client.connect();
      console.log("Connected to Lit");
    } catch (error) {
      console.error("Failed to connect to Lit:", error);
    }
  }
  /**
   * Retrieves the authentication signature.
   * @returns {Promise<void>} A promise that resolves when the authentication signature is retrieved.
   */
  async getAuthSig() {
    authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: chain });
    console.log("Auth sig:", authSig);
  }
  /**
   * Encrypts a book file and returns the IPFS CID.
   * @param bookFile - The book file to be encrypted.
   * @param bookAddress - The address of the book.
   * @returns The IPFS CID of the encrypted book.
   * @throws If the client is not connected, or if the book address is missing.
   */
  async encrypt(bookFile: File, bookAddress: string) {
    await this.connect();
    // Check if the book address is missing
    if (!bookAddress) {
      console.log("Book address is required");
      throw new Error("Book address is required");
    }
    // Update the contractAddress property of the accessControlConditions object
    const updatedAccessControlConditions = [
      {
        ...accessControlConditions[0], // Spread the existing properties
        contractAddress: bookAddress, // Override the contractAddress property
      },
    ];
    console.log("updatedAccessControlConditions are: ", updatedAccessControlConditions);
    // Check if the authentication signature is missing
    if (!authSig) {
      await this.getAuthSig();
    }
    // Encrypt the book file and return the IPFS CID
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
      console.log("IPFS CID:", ipfsCid);
      return ipfsCid;
    } catch (error) {
      console.error("Failed to encrypt:", error);
      throw error; // This will re-throw the error, whether it's an instance of Error or not
    }
  }

  /**
   * Decrypts a file from IPFS using LitJsSdk.
   * @param ipfsCid - The IPFS CID of the file to decrypt.
   * @returns The decrypted file.
   * @throws If decryption fails.
   */
  async decrypt(ipfsCid: string) {
    // Check if the client is connected
    if (!client) {
      await this.connect();
    }
    // Check if the authentication signature is missing
    if (!authSig) {
      await this.getAuthSig();
    }
    // Decrypt the file and return it
    try {
      const decryptedFile = await LitJsSdk.decryptFromIpfs({
        authSig: authSig,
        ipfsCid: ipfsCid,
        litNodeClient: client,
      });
      return decryptedFile;
    } catch (error) {
      console.error("Failed to decrypt:", error);
      throw error;
    }
  }
}
const litInstance = new Lit();
export default litInstance;
