import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { fetchHypercertBalance } from "../../graphql/queries";
import { useAccount } from "wagmi";

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
    <div className="flex justify-center align-middle">
      <ConnectButton />
    </div>
  );
}
