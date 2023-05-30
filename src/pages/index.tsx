import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Navbar from "@/components/Navigation Bar/Navbar";
import { Button } from "@chakra-ui/react";

export default function Home() {
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
