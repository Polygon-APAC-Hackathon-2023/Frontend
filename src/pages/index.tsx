import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
      <div className="flex justify-center align-middle">
      <ConnectButton />
    </div>
  );
}
