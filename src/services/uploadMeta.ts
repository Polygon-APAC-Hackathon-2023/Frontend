import { NFTStorage } from "nft.storage";
import * as IPFS from "ipfs";

declare global {
  var ipfs: IPFS.IPFS | undefined;
}

const client = globalThis.ipfs || IPFS.create();

export const uploadMetadata = async (metadata: any) => {
  const node = await client;
  const data = JSON.stringify(metadata);
  const results = await node.add(data);
  console.log(results);
};

export const fetchData = async (hash: string) => {
  const node = await client;
  console.log("masuk");
  const stream = node.cat("QmbCBN7cjAdMhGrv65Xi5i1qs5VF6NTanHk1EMyofjkbWH");
  const decoder = new TextDecoder();
  let data = "";

  for await (const chunk of stream) {
    // chunks of data are returned as a Uint8Array, convert it back to a string
    data += decoder.decode(chunk, { stream: true });
  }

  console.log("your data is", data);
};

// QmbCBN7cjAdMhGrv65Xi5i1qs5VF6NTanHk1EMyofjkbWH
