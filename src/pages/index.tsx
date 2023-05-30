import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { fetchHypercertBalance } from "../../graphql/queries";
import { useAccount } from "wagmi";
import Navbar from "@/components/Navigation Bar/Navbar";
import { Button } from "@chakra-ui/react";

export default function Home() {
  const { address, status } = useAccount();

  React.useEffect(() => {
    const getHypercertBalance = async (address: string) => {
      const data = await fetchHypercertBalance(address);

      const balances: { [key: string]: string } = {};

      data.account?.ERC1155balances?.forEach((balance: any) => {
        const identifier = balance.token.identifier;
        const valueExact = balance.token.balances[0].valueExact;
        balances[identifier] = valueExact;
      });

      console.log(balances);
    };

    if (status === "connected") {
      getHypercertBalance(address);
    }
  }, [address, status]);

  return (
    <div>
      <div className="flex justify-between mt-[20px] mx-[30px]">
        <div>
          <h1 className="text-[30px]">ReIgnite</h1>
        </div>
        <div className="flex justify-center align-middle">
          <Navbar />
          <ConnectButton />
        </div>
      </div>
      <div className="flex justify-center align-middle text-[45px] mt-[300px]">
        <p>Welcome to ReIgnite the first public goods web3 application</p>
      </div>
      <div className="flex justify-center align-middle mt-[50px]">
        <Button className="mr-[10px]">Get Started</Button>
        <Button className="ml-[10px]">Explore</Button>
      </div>
    </div>
  );
}
