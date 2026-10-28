import { defineChain } from "viem";

export const botchainTestnet = defineChain({
  id: 968,
  name: "Botchain Testnet",
  nativeCurrency: {
    name: "BOT",
    symbol: "tBOT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.bohr.life"],
    },
    public: {
      http: ["https://rpc.bohr.life"],
    },
  },
  blockExplorers: {
    default: {
      name: "BohrScan",
      url: "https://scan.bohr.life",
    },
  },
  fees: {
    estimateFeesPerGas: async () => {
      // Botchain Testnet strictly requires minimum priority fee of 20 Gwei (20000000000)
      return {
        maxPriorityFeePerGas: 25000000000n, // 25 Gwei
        maxFeePerGas: 35000000000n, // 35 Gwei
      };
    },
  },
  testnet: true,
});
