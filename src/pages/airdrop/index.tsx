import React, { useState } from "react";
import { localhost, polygonMumbai } from "@wagmi/chains";
import { useContractReads, useAccount, useConnect, useNetwork } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from "wagmi/connectors/injected";
import Hypercert from "../../../public/Hypercert.json";

const hypercertContract = {
  contractAddress: "0x0cDaa4A6df7b761C9785b399470e947e011E1955",
  abi: Hypercert.abi,
};

const connector = new MetaMaskConnector({
  chains: [localhost],
});

function test(selectedTokenID: string) {
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        functionName: "grantEnded",
        args: [selectedTokenID],
        ...hypercertContract,
      },
      {
        functionName: "grantOwner",
        args: [selectedTokenID],
        ...hypercertContract,
      },
    ],
  });

  console.log(data);

  const grantEnded = data ? [0] : false;
  const grantOwner = data ? [1] : "";

  return [grantEnded, grantOwner, isError, isLoading];
}

export default function ProgressBar() {
  const [selectedTokenID, setSelectedTokenID] = useState("");
  const [isGrantVerified, setIsGrantVerified] = useState(false);
  const [isFundsDeposited, setIsFundsDeposited] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [maticAddress, setMaticAddress] = useState("");
  const [inputError, setInputError] = useState(false);

  const { isConnected, address } = useAccount();
  const { chain, chains } = useNetwork();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const handleTokenIDChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, ""); // Replace non-numeric characters
    setSelectedTokenID(inputValue);
    setInputError(false); // Reset input error when token ID changes
  };

  const handleVerifyGrant = async () => {
    if (selectedTokenID === "") {
      setInputError(true);
    } else {
      setInputError(false);
    }

    const [grantEnded, grantOwner, isError, isLoading] = test(selectedTokenID);

    if (isError) {
      // Handle the error
      console.error(isError);
    } else {
      //if the grant ended returns true and the grant owner is the same as the address, then the grant is verified
      if (grantEnded && grantOwner === address) {
        setIsGrantVerified(true);
      }
    }
  };

  const handleDepositFunds = () => {
    // Make API calls to Circle to create a wallet and to create a Matic blockchain address
    // Set walletAddress and maticAddress with the retrieved data
    setWalletAddress("exampleWalletAddress"); // Placeholder
    setMaticAddress("exampleMaticAddress"); // Placeholder
    setIsFundsDeposited(true);
  };

  const handleAirdrop = () => {
    // Call deployed contract to send funds to the contract and transfer to holders of NFT token ID
    // Implement the necessary logic for the airdrop
    console.log("Airdrop initiated"); // Placeholder
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        Grant Airdrop to be initiated by
        {isConnected ? (
          <span className="text-blue-500">
            {" "}
            {address} on {chain?.name}
          </span>
        ) : (
          //include a connect wallet button
          <button
            className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
            onClick={connect}
          >
            Connect Wallet
          </button>
        )}
      </h1>

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
            isFundsDeposited ? "bg-blue-500" : "bg-gray-500"
          }`}
        ></div>
        <p className="ml-2">Deposit Funds</p>
      </div>
      {isGrantVerified && (
        <div className="flex items-center mb-6">
          <input
            type="text"
            className="px-2 py-1 border border-gray-300 rounded"
            placeholder="Enter Description (Optional)"
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleDepositFunds}
          >
            Done
          </button>
        </div>
      )}

      {/* Section 3: Airdrop */}
      <div className="flex items-center mb-6">
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
