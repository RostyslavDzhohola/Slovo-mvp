"use client ";

import * as LitJsSdk from "@lit-protocol/lit-node-client";

const litNodeClient = new LitJsSdk.LitNodeClient({
  litNetwork: "cayenne",
  debug: true,
});
const chain = "mumbai";

class Lit {
  async connect() {
    try {
      await litNodeClient.connect();
      console.log("Connected to Lit");
      // const nonce = litNodeClient.getLatestBlockhash();
      // console.log("GENERATED NONCE: ", nonce);
      // const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: chain, nonce: nonce });
      // console.log("Auth sig:", authSig);
    } catch (error) {
      console.error("Failed to connect to Lit:", error);
    }
  }

  async getAuthSig() {
    const nonce = litNodeClient.getLatestBlockhash();
    console.log("GENERATED NONCE: ", nonce);
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: chain, nonce: nonce });
    console.log("Auth sig:", authSig);
  }
}

const litInstance = new Lit();
export default litInstance;
