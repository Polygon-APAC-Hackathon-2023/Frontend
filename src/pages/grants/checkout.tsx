import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useGrantCartStore } from "../../../utils/store";
import { toast } from "react-hot-toast";
import React from "react";
import TrashIcon from "@/components/icons/Trash";

interface Grant {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function CheckoutGrants() {
  const { grants, updateCart, removeFromCart } = useGrantCartStore();

  const checkout = () => {
    toast.success("Grant added to cart!");
  };

  const updateValue = (id: string, amount: string) => {
    updateCart(id, Number(amount));
  };

  const removeGrantFromCart = (grantId: string) => {
    removeFromCart(grantId);
    toast.success("Grant removed from cart!");
  };

  return grants ? (
    <main className="flex min-h-screen flex-row items-start px-8 py-24 gap-6">
      <div className="flex flex-col w-full gap-y-6 basis-[3/5]">
        {grants &&
          grants.map((grant) => (
            <div
              className="flex flex-row w-full items-center bg-slate-200 rounded-lg overflow-hidden text-black"
              key={grant.id}
            >
              <div className="flex aspect-square relative w-[128px]">
                <Image src={grant.image} alt="Random" fill />
              </div>
              <div className="flex flex-col w-full p-4 gap-y-2">
                <p className="font-bold text-lg">{grant.name}</p>
                <p className="text-ellipsis overflow-hidden text-sm">
                  Address: {grant.id}
                </p>
              </div>
              <div className="px-2 flex flex-row items-center gap-x-2">
                <input
                  type="number"
                  className="min-w-[128px] w-full h-full p-2 rounded-lg"
                  onChange={(e) => updateValue(grant.id, e.target.value)}
                />
                <p>USDC</p>
              </div>
              <button
                onClick={() => removeGrantFromCart(grant.id)}
                className="mx-4 max-w-[24px] cursor-pointer"
              >
                <TrashIcon className="fill-red-500 w-[24px]" />
              </button>
            </div>
          ))}
      </div>
      <div className="flex flex-col w-full basis-[2/5]">
        <div className="flex flex-col bg-slate-200 w-full rounded-lg p-6 text-black">
          <h1 className="font-bold my-6 text-2xl">Checkout Grants</h1>
          {grants.map((grant) => (
            <div
              className="flex flex-row w-full items-center justify-between"
              key={grant.id}
            >
              <p>{grant.name}</p>
              <p>{grant.amount} USDC</p>
            </div>
          ))}
          <hr className="border w-full my-4 border-black" />
          <div className="flex flex-row w-full items-center justify-between">
            <p>Total</p>
            <p>{grants.reduce((prev, curr) => prev + curr.amount, 0)} USDC</p>
          </div>
          <button className="w-full rounded-full p-6 font-bold text-black bg-slate-400 my-4">
            Checkout
          </button>
        </div>
      </div>
    </main>
  ) : (
    <></>
  );
}
