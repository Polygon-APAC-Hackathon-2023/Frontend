import Navbar from "@/components/Navigation Bar/Navbar";
import CardComponent from "@/components/card/Card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { useAccount, useContractRead, useContractReads } from "wagmi";
import Hypercert from "../../../public/Hypercert.json";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { isAddress } from "ethers/lib/utils.js";

const Profile = () => {
  const router = useRouter();
  const { wallet } = router.query;
  const exampleArray = [1, 2, 3, 4, 5, 6];
  const { address, isConnected } = useAccount();
  const [addressState, setAddressState] = useState<string>("");
  const [grants, setGrants] = useState<Array<number>>([]);
  const [grantData, setGrantData] = useState<Array<any>>([]);
  //fetch what grant they created
  const { data } = useContractRead({
    address: "0x2084200f96AFc5d2e0e59829F875F296d25F49D7",
    abi: Hypercert.abi,
    functionName: "grantsCreatedByAddress",
    args: [address],
    onSuccess: (data: number[]) => {
      console.log(data);
      setGrants(data);
    },
  });

  return (
    <>
      {/* <div className="flex justify-between mt-[20px] mx-[30px]">
        <div>
          <h1 className="text-[30px]">🔥 ReIgnite</h1>
        </div>
        <div className="flex justify-center align-middle">
          <Navbar />
          <ConnectButton />
        </div>
      </div> */}
      <div className="mx-[100px]">
        <h1 className="text-[60px]">Profile</h1>
        <div>
          <h2>Grants Created</h2>
          <div className="grid grid-cols-5 gap-4">
            {data?.map((item, key) => {
              return (
                <div key={key}>
                  <CardComponent tokenId={item} />
                </div>
              );
            }, [])}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
