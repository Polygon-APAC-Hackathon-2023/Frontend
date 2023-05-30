import { Button } from "@chakra-ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex align-middle">
      <ul className="flex text-[20px] mr-[10px] align-middle justify-center">
        <li className="mr-[10px]">
          <Button>
            <Link href="/createGrant">Create Grant</Link>
          </Button>
        </li>
        <li>
          <Button>
            <Link href="/grants">Explore</Link>
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
