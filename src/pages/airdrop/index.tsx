import React, { useEffect, useState } from "react";
import { localhost, polygonMumbai } from "@wagmi/chains";
import { useContractRead, useAccount, useConnect, useNetwork } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from "wagmi/connectors/injected";
import Hypercert from "../../../public/Hypercert.json";
import { Polybase } from "@polybase/client";
import fetch from "node-fetch";
import * as eth from "@polybase/eth";

const hypercertAddress = "0x2084200f96AFc5d2e0e59829F875F296d25F49D7";

const connector = new MetaMaskConnector({
  chains: [localhost, polygonMumbai],
});

const db = new Polybase({
  defaultNamespace:
    "pk/0xbef7617e6fbf3cf8b4177ca17c6ad2ca37e42a31ec447b24b923112d66fb3e0167bc11d11d306ddd9dee47e680b186bd1d250b079e6a054e79b7baa0ffc16260/ReIgnite",
});
const collectionReference = db.collection("City");

// Add signer fn
db.signer(async (data: string) => {
  // A permission dialog will be presented to the user
  const accounts = await eth.requestAccounts();

  // If there is more than one account, you may wish to ask the user which
  // account they would like to use
  const account = accounts[0];

  const sig = await eth.sign(data, account);

  return { h: "eth-personal-sign", sig };
});

async function createRecord(data: string) {
  const recordData = await collectionReference.create([
    "new-york",
    "New York",
    db.collection("Person").record("johnbmahone"),
  ]);
}

// createRecord(data);

async function readRecord() {
  const data = await db.collection("User").get();
  console.log(data);
}

// readRecord();

// function to generate a random UUID
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    // eslint-disable-next-line
    const r = (Math.random() * 16) | 0,
      // eslint-disable-next-line
      v = c === "x" ? r : (r & 0x3) | 0x8;
    // eslint-disable-next-line
    return v.toString(16);
  });
}

export async function createWallet(description: string) {
  const idempotencyKey = uuidv4();
  const url = "https://api-sandbox.circle.com/v1/wallets";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization:
        "Bearer SAND_API_KEY:3d48568ed5c14a5856f1e70b5836e6af:b0478a88f58afe0ae1113a8f26fc9a94",
    },
    body: JSON.stringify({
      idempotencyKey: idempotencyKey,
      description: description,
    }),
  };

  const response = await fetch(url, options);

  const json = await response.json();
  console.log(json.data.walletId);
  return [json.data.walletId, idempotencyKey];
}

export async function createBlockchainAddress(
  walletID: number,
  idempotencyKey: string
) {
  const url = `https://api-sandbox.circle.com/v1/wallets/${walletID}/addresses`;
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization:
        "Bearer SAND_API_KEY:3d48568ed5c14a5856f1e70b5836e6af:b0478a88f58afe0ae1113a8f26fc9a94",
    },
    body: JSON.stringify({
      idempotencyKey: idempotencyKey,
      currency: "USD",
      chain: "MATIC",
    }),
  };

  const response = await fetch(url, options);

  const json = await response.json();
  return json.data.address;
}

export async function checkTransferStatus(walletID: number) {
  const url = `https://api-sandbox.circle.com/v1/transfers?walletId=${walletID}&returnIdentities=false`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization:
        "Bearer SAND_API_KEY:3d48568ed5c14a5856f1e70b5836e6af:b0478a88f58afe0ae1113a8f26fc9a94",
    },
  };

  const response = await fetch(url, options);

  const json = await response.json();

  console.log(json);

  //use polygonscan mumbai to check if the transaction is successful and has a minimum of 30 block confirmations
  const url2 = `https://api-testnet.polygonscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${json.data.transactionHash}&apikey=YourApiKeyToken`;
  const options2 = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  const response2 = await fetch(url2, options2);
  const json2 = await response2.json();
  //if json is undefined, return 0 instead of 1
  if (json2.result === undefined) {
    return 0;
  } else {
    return json2.data?.result.status;
  }
}

export default function ProgressBar() {
  const [selectedTokenID, setSelectedTokenID] = useState("");
  const [isGrantVerified, setIsGrantVerified] = useState(false);
  const [isGrantEnded, setIsGrantEnded] = useState(false);
  const [grantOwner, setGrantOwner] = useState("");
  const [isFundsDeposited, setIsFundsDeposited] = useState(false);
  const [isWalletAddressCreated, setIsWalletAddressCreated] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [inputError, setInputError] = useState(false);
  const [isVerificationClicked, setIsVerificationClicked] = useState(false);
  const [description, setDescription] = useState("");
  const [walletID, setWalletID] = useState(null);
  const [idempotencyKey, setIdempotencyKey] = useState("");

  const { isConnected, address } = useAccount();
  const [isConnect, setIsConnect] = useState(false);
  const { chain, chains } = useNetwork();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const handleTokenIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ""); // Replace non-numeric characters
    setSelectedTokenID(inputValue);
    setInputError(false); // Reset input error when token ID changes
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const { data: dataOne } = useContractRead({
    abi: Hypercert.abi,
    address: hypercertAddress,
    functionName: "grantEnded(uint256)",
    args: [selectedTokenID],
    watch: true,
    onError: (err: any) => {
      console.error(err);
    },
  });

  const { data: dataTwo } = useContractRead({
    abi: Hypercert.abi,
    address: hypercertAddress,
    functionName: "grantOwner(uint256)",
    args: [selectedTokenID],
    watch: true,
    onError: (err: any) => {
      console.error(err);
    },
  });

  const handleVerifyGrant = async () => {
    if (selectedTokenID === "") {
      setInputError(true);
    } else {
      setInputError(false);
    }

    console.log("tokenidis:", selectedTokenID);
    console.log(dataOne, dataTwo);

    // Perform a check before fetching contract data.
    // If grantEnded is true and grantOwner is the same as the connected wallet address, then grant is verified
    if (isGrantEnded && grantOwner === address) {
      setIsGrantVerified(true);
    } else {
      setIsGrantVerified(false);
      alert("Grant has not ended or you are not the grant owner");
    }

    setIsVerificationClicked(true); // Set the state to true after verification
  };

  const handleDepositFunds = async (description: string) => {
    //call createWallet() function
    const [walletID, idempotencyKey] = await createWallet(description);
    console.log(walletID, idempotencyKey);
    setWalletID(walletID);
    setIdempotencyKey(idempotencyKey);

    //call createBlockchainAddress() function
    const address = await createBlockchainAddress(walletID, idempotencyKey);
    console.log(address);
    setWalletAddress(address);
  };

  const handleDepositCheck = async (walletID: number) => {
    //call checkTransferStatus() function
    if ((await checkTransferStatus(walletID)) === 1) {
      setIsFundsDeposited(true);
    } else {
      setIsFundsDeposited(false);
      //also tell the user that no funds have been deposited
      alert("No funds have been deposited");
    }
  };

  const handleAirdrop = () => {
    // Call deployed contract to send funds to the contract and transfer to holders of NFT token ID
    // Implement the necessary logic for the airdrop
    console.log("Airdrop initiated"); // Placeholder
  };

  useEffect(() => {
    if (isConnected) {
      setIsConnect(true);
    }
  }, [isConnected]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-3xl font-bold mb-8 flex">
        <h1 className="text-3xl font-bold mr-[5px]">
          Grant Airdrop to be initiated by
        </h1>
        <div>
          {isConnect && (
            <p className="text-blue-500">
              {" "}
              {address} on {chain?.name}
            </p>
          )}
          {!isConnect && (
            <button
              className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
              onClick={() => connect()}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
      {/* Section 1: Choose Grant */}
      <div className="flex items-center mb-6">
        <div
          className={`w-6 h-6 rounded-full ${
            isGrantVerified ? "bg-blue-500" : "bg-gray-500"
          }`}
        ></div>
        <div className="flex flex-row">
          <p className="ml-2">Choose Grant</p>
        </div>
      </div>

      <div className="flex items-center mb-5">
        <input
          type="text"
          value={selectedTokenID}
          onChange={handleTokenIDChange}
          className="px-2 py-1 border border-gray-300 rounded"
          placeholder="Enter Token ID"
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleVerifyGrant}
        >
          Verify
        </button>
      </div>

      {inputError && (
        <p className="text-red-500 mb-4">Please provide a Token ID.</p>
      )}
      {isGrantVerified && (
        <div className="flex items-center mt-1 md-5">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-5"></div>
          <p>Grant ended</p>
          <div className="w-3 h-3 rounded-full bg-green-500 mr-5 ml-5"></div>
          <p>Grant creator</p>
        </div>
      )}

      {/* Section 2: Deposit Funds */}
      <div className="flex items-center mb-6 mt-10">
        <div
          className={`w-6 h-6 rounded-full ${
            isWalletAddressCreated ? "bg-blue-500" : "bg-gray-500"
          }`}
        ></div>
        <p className="ml-2">Deposit Funds</p>
      </div>
      {isGrantVerified && (
        <>
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <input
                type="text"
                value={description}
                onChange={handleDescriptionChange}
                className="px-2 py-1 border border-gray-300 rounded"
                placeholder="Enter Description (Optional)"
              />
            </div>
            <button
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => handleDepositFunds(description)}
            >
              Create Wallet Address
            </button>
          </div>
          {walletID && (
            <div className="flex items-center mb-6">
              <p className="mr-2">Wallet ID:</p>
              <p className="text-blue-500">{walletID}</p>
            </div>
          )}
          {walletAddress && (
            <div className="flex items-center mb-6">
              <p className="mr-2">Wallet Address:</p>
              <p className="text-blue-500">{walletAddress}</p>
            </div>
          )}
          {walletAddress && walletID && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => handleDepositCheck(walletID)}
            >
              I have deposited USDC on Polygon Mumbai to the above address
            </button>
          )}
        </>
      )}

      {/* Section 3: Airdrop */}
      <div className="flex items-center mb-10 mt-10">
        <div
          className={`w-6 h-6 rounded-full ${
            isFundsDeposited ? "bg-blue-500" : "bg-gray-500"
          }`}
        ></div>
        <p className="ml-2">Airdrop</p>
      </div>
      {isFundsDeposited && (
        <div className="flex items-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleAirdrop}
          >
            Initiate Airdrop
          </button>
        </div>
      )}
    </div>
  );
}
