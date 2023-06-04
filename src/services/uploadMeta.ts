import { NFTStorage } from "nft.storage";
import * as IPFS from "ipfs";

declare global {
  var ipfs: IPFS.IPFS | undefined;
}

const client =
  globalThis.ipfs || IPFS.create({ repo: "apac-" + Math.random() });

export const uploadMetadata = async (metadata: any) => {
  const node = await client;
  const data = JSON.stringify(metadata);
  const results = await node.add(data);
  console.log(results);
  return results;
};

export const fetchData = async (hash: string) => {
  try {
    const node = await client;
    const stream = node.cat(hash);
    const decoder = new TextDecoder();
    let data = "";

    for await (const chunk of stream) {
      // chunks of data are returned as a Uint8Array, convert it back to a string
      try {
        data += decoder.decode(chunk, { stream: true });
      } catch (err) {
        console.log(err);
      }
    }
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }

  return {
    name: "New Grant",
  };
};

// QmbCBN7cjAdMhGrv65Xi5i1qs5VF6NTanHk1EMyofjkbWH
