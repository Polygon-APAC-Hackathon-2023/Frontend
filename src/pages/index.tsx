import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { fetchHypercertBalance } from "../../graphql/queries";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center text-center items-center px-8 py-12 min-h-screen">
      <h1 className="font-bold text-4xl text-center">
        🔥 <br /> ReIgnite
      </h1>
      <h2 className="my-8 text-xl">Let&apos;s reignite the passion to give.</h2>
      <ConnectButton />
      <div className="flex flex-row gap-x-8 my-8">
        <Link href="/createGrant" target="_blank">
          <button className="bg-orange-500 rounded-lg text-white font-bold py-2 px-4">
            Create Grants
          </button>
        </Link>
        <Link href="/grants" target="_blank">
          <button className="bg-teal-500 rounded-lg text-white font-bold py-2 px-4">
            View Grants
          </button>
        </Link>
        <button className="bg-indigo-500 rounded-lg text-white font-bold py-2 px-4">
          Setup Polygon ID
        </button>
      </div>
    </div>
  );
}
