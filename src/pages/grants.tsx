import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useGrantCartStore } from "../../utils/store";
import { toast } from "react-hot-toast";

interface Grant {
  id: string;
  name: string;
  description: string;
  image: string;
}

const grants: Grant[] = [
  {
    id: "0xa650a0661ad3cf8a4dc55505bc56e80f100b6e5e",
    name: "Grant 1",
    description: "This is a grant",
    image: "https://picsum.photos/256",
  },
  {
    id: "0x8950a0661ad3cf8a4dc55505bc56e80f100b6e5e",
    name: "Grant 2",
    description: "This is a grant 2",
    image: "https://picsum.photos/256",
  },
  {
    id: "0xah50a0661ad3cf8a4dc55505bc56e80f100b6e5e",
    name: "Grant 3",
    description: "This is a grant 3",
    image: "https://picsum.photos/256",
  },
];

export default function Grants() {
  const { addToCart } = useGrantCartStore();

  const addGrantToCart = (grant: Grant) => {
    addToCart(grant);
    toast.success("Grant added to cart!");
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-bold my-6 text-2xl">Grants</h1>
        <div className="grid grid-cols-3 items-center justify-center w-full gap-6 lg:gap-x-12 cursor-pointer">
          {grants.map((grant) => (
            <div
              className="flex flex-col w-full items-center bg-slate-400 rounded-lg overflow-hidden max-w-xs hover:scale-110 transform transition-transform"
              onClick={() => addGrantToCart(grant)}
              key={grant.id}
            >
              <div className="flex aspect-square w-full relative">
                <Image src={grant.image} alt="Random" fill />
              </div>
              <div className="flex flex-col w-full p-4 gap-y-2">
                <p className="font-bold text-lg">{grant.name}</p>
                <p className="line-clamp-3">{grant.description}</p>
                <p className="text-ellipsis overflow-hidden text-sm">
                  Address: {grant.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
