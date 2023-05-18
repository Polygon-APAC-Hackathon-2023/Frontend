import Hypercert from "../public/Hypercert.json";
import MockUSDC from "../public/MockUSDC.json";
import FundingPool from "../public/FundingPool.json";

export const HYPERCERT_CONTRACT = {
  address: "0x5641aa9764b0dd1c973afb05fe443c385fddbb78" as `0x${string}`,
  abi: Hypercert.abi,
};

export const USDC_CONTRACT = {
  address: "0x2a12b5a9719afba63b95d7286a60c66ea2670f02" as `0x${string}`,
  abi: MockUSDC.abi,
};

export const FUNDING_POOL_CONTRACT = {
  address: "0x09c352755905fcda2c08f7d5585af71657b1cdce" as `0x${string}`,
  abi: FundingPool.abi,
};
