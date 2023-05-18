import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useGrantCartStore } from "../../../utils/store";
import { toast } from "react-hot-toast";
import clsx from "clsx";
import Link from "next/link";
import {
  paginatedIndexesConfig,
  useContractInfiniteReads,
  useContractRead,
  useContractReads,
} from "wagmi";
import Hypercert from "../../../public/Hypercert.json";
import { useEffect, useState } from "react";
import { fetchData } from "@/services/uploadMeta";

interface Grant {
  id: number;
  name: string;
  description: string;
  image: string;
}

export default function Grants() {
  const {
    addToCart,
    removeFromCart,
    grants: selectedGrants,
  } = useGrantCartStore();
  const [grants, setGrants] = useState<any>();

  const contract = {
    address: "0xf1542d2094cbb84f4b6c90ed100a1a36cbbff54c" as `0x${string}`,
    abi: Hypercert.abi,
  };
  const ITEMS_PER_PAGE = 12;

  const { data } = useContractReads({
    contracts: [
      {
        ...contract,
        functionName: "latestUnusedId",
      },
    ],
    watch: true,
  });

  const { data: grantsData, fetchNextPage } = useContractInfiniteReads({
    cacheKey: "grants-data",
    ...paginatedIndexesConfig(
      (index) => {
        return [
          {
            ...contract,
            functionName: "uri",
            args: [index] as const,
          },
        ];
      },
      { start: 0, perPage: ITEMS_PER_PAGE, direction: "increment" }
    ),
  });

  const addGrantToCart = (grant: Grant) => {
    addToCart(grant);
    toast.success("Grant added to cart!");
  };

  const removeGrantFromCart = (grantId: number) => {
    removeFromCart(grantId);
    toast.success("Grant removed from cart!");
  };

  useEffect(() => {
    const getGrantsInfo = async () => {
      const grants = [];
      let index = 0;
      for await (const page of grantsData!.pages) {
        for await (const grantHash of page) {
          if (grantHash) {
            const data = await fetchData(grantHash as string);
            index++;
            grants.push({
              id: index,
              name: data.name,
              description: data.description || "Donate to this grant!",
              image: data.image || `https://picsum.photos/${index}/256`,
            });
          }
        }
      }

      setGrants(grants);
    };

    if (grantsData && grantsData.pages) {
      getGrantsInfo();
    }
  }, [grantsData, grantsData?.pages]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-bold my-6 text-2xl">Grants</h1>
        <div className="grid grid-cols-3 items-center justify-center w-full gap-6 lg:gap-x-12">
          {grants &&
            grants.map((grant: any) => {
              const selected = selectedGrants.some(
                (obj) => obj.id === grant.id
              );
              return (
                <div
                  className={clsx(
                    "flex flex-col w-full items-center bg-slate-400 rounded-lg overflow-hidden max-w-xs hover:scale-110 transform transition-transform cursor-pointer",
                    selected ? "border-4 border-green-500" : ""
                  )}
                  onClick={() =>
                    selected
                      ? removeGrantFromCart(grant.id)
                      : addGrantToCart(grant)
                  }
                  key={grant.id}
                >
                  <div className="flex aspect-square w-full relative">
                    <Image src={grant.image} alt="Random" fill />
                  </div>
                  <div className="flex flex-col w-full p-4 gap-y-2">
                    <p className="font-bold text-lg">{grant.name}</p>
                    <p className="line-clamp-3">{grant.description}</p>
                    <p className="text-ellipsis overflow-hidden text-sm">
                      Token ID: {grant.id}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
        <Link
          className="w-full items-center justify-center flex font-bold text-lg p-4 bg-slate-400 rounded-full max-w-xs my-8"
          href="/grants/checkout"
        >
          Checkout
        </Link>
      </div>
    </main>
  );
}
