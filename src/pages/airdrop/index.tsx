import React, { useEffect, useState } from "react";
import { localhost, polygonMumbai } from "@wagmi/chains";
import { useContractRead, useAccount, useConnect, useNetwork } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from "wagmi/connectors/injected";
import Hypercert from "../../../public/Hypercert.json";

const hypercertAddress = "0x2084200f96AFc5d2e0e59829F875F296d25F49D7";

const connector = new MetaMaskConnector({
  chains: [localhost],
});

export default function ProgressBar() {
  const [selectedTokenID, setSelectedTokenID] = useState("");
  const [isGrantVerified, setIsGrantVerified] = useState(false);
  const [isFundsDeposited, setIsFundsDeposited] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [maticAddress, setMaticAddress] = useState("");
  const [inputError, setInputError] = useState(false);

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

  console.log(dataOne);
  console.log(dataTwo);

  const handleVerifyGrant = async () => {
    if (selectedTokenID === "") {
      setInputError(true);
    } else {
      setInputError(false);
    }

    console.log(dataTwo === address);
    // Perform a check before fetching contract data.
    // If grantEnded is true and grantOwner is the same as the connected wallet address, then grant is verified
    if (dataOne && dataTwo && dataOne === true && dataTwo === address) {
      setIsGrantVerified(true);
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
