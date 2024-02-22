/* eslint-disable import/no-anonymous-default-export */
import * as LitJsSdk from "@lit-protocol/lit-node-client";

const client = new LitJsSdk.LitNodeClient({ litNetwork: "cayenne" });

await client.connect();
console.log("LitNodeClient connected");

// const accessControlConditions = [
//   {
//     contractAddress: "", // bookNFT contract address
//     standardContractType: "ERC721", // ERC721
//     chain: "mumbai",
//     method: "balanceOf",
//     parameters: [":userAddress"],
//     returnValueTest: {
//       comparator: ">=",
//       value: "1", // at least 1 NFT of the book
//     },
//   },
// ];

class Lit {
  litNodeClient: LitJsSdk.LitNodeClient = new LitNodeClient();
  // TODO: add SIWE verification in order to get the LitNodeClient instance resigned with the Metamask
  async connect() {
    if (typeof window !== "undefined") {
      console.log("Running on the client");
    } else {
      console.log("Running on the server");
    }

    try {
      await client.connect();
      this.litNodeClient = client;
      console.log("LitNodeClient is: ", this.litNodeClient instanceof LitJsSdk.LitNodeClient);
      console.log("LitNodeClient connected");
    } catch (e) {
      console.log("LitNodeClient connection failed: ", e);
    }
  }
}

export default new Lit();
