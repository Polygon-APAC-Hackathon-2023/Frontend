import Hypercert from "../public/Hypercert.json";
import MockUSDC from "../public/MockUSDC.json";
import FundingPool from "../public/FundingPool.json";
import QfPool from "../public/QfPool.json";

export const HYPERCERT_CONTRACT = {
  address: "0xF41b72fa91eEA7c3b87526EbAc58BE28dCCBb32d" as `0x${string}`,
  abi: Hypercert.abi,
};

export const USDC_CONTRACT = {
  address: "0xFde74dF8A4D6ADB74CB0d3201e756A8929Df647c" as `0x${string}`,
  abi: MockUSDC.abi,
};

export const FUNDING_POOL_CONTRACT = {
  address: "0xE3Fe25753c875c99f8C66421C4365cba966c3dBE" as `0x${string}`,
  abi: FundingPool.abi,
};

export const QF_POOL_CONTRACT = {
  address: "0xEA47f665A1535E1adf57f253f1551d8816aA60cc" as `0x${string}`,
  abi: QfPool.abi,
};
