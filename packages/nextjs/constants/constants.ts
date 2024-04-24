import { arbitrumSepolia, scrollSepolia } from "viem/chains";

export const chainNames = ["ArbitrumSepolia"]; //, "ScrollSepolia"];
export const chainAssets = {
  [chainNames[0]]: ["ETH", "USDC", "LINK"],
  // [chainNames[1]]: ["ETH", "LINK"],
};
export const chainRPCDetails = {
  [chainNames[0]]: arbitrumSepolia,
  [chainNames[1]]: scrollSepolia,
};
export const chainAssetDetails = {
  [chainNames[0] + " | " + chainAssets[chainNames[0]][0]]: {
    symbol: "ETH",
    address: "0x0000000000000000000000000000000000000000",
    type: "1",
    decimals: 18,
  },
  [chainNames[0] + " | " + chainAssets[chainNames[0]][1]]: {
    symbol: "USDC",
    address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    type: "2",
    decimals: 6,
  },
  [chainNames[0] + " | " + chainAssets[chainNames[0]][2]]: {
    symbol: "LINK",
    address: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
    type: "2",
    decimals: 18,
  },
  // [chainNames[1] + " | " + chainAssets[chainNames[1]][0]]: {
  //   symbol: "ETH",
  //   address: "0x0000000000000000000000000000000000000000",
  //   type: "1",
  //   decimals: 18,
  // },
  // [chainNames[1] + " | " + chainAssets[chainNames[1]][1]]: {
  //   symbol: "LINK",
  //   address: "0x7273ebbB21F8D8AcF2bC12E71a08937712E9E40c",
  //   type: "2",
  //   decimals: 18,
  // },
};
export const chainIdToChain = {
  421614: arbitrumSepolia,
};
