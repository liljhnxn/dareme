import { defineChain } from "viem";

export const botchainMainnet = defineChain({
  id: 677,
  name: "BOT Chain",
  nativeCurrency: {
    name: "BOT",
    symbol: "BOT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.botchain.ai"],
    },
    public: {
      http: ["https://rpc.botchain.ai"],
    },
  },
  blockExplorers: {
    default: {
      name: "BOT Chain Explorer",
      url: "https://scan.botchain.ai",
    },
  },
  fees: {
    estimateFeesPerGas: async () => {
      return {
        maxPriorityFeePerGas: 20000000000n, // 20 Gwei
        maxFeePerGas: 25000000000n, // 25 Gwei
      };
    },
  },
});

export const activeChain = botchainMainnet;
