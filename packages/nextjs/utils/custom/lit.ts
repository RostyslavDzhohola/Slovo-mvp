"use client ";

import * as LitJsSdk from "@lit-protocol/lit-node-client";

const client = new LitJsSdk.LitNodeClient({
  litNetwork: "cayenne",
});

class Lit {
  async connect() {
    try {
      await client.connect();
      console.log("Connected to Lit");
    } catch (error) {
      console.error("Failed to connect to Lit:", error);
    }
  }
}

const litInstance = new Lit();
export default litInstance;
