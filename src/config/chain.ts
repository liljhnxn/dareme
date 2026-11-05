import { defineChain } from "viem";

export const botchainMainnet = defineChain({
  id: 677,
  name: "Botchain Mainnet",
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
      name: "BotchainScan",
      url: "https://scan.botchain.ai",
    },
  },
  fees: {
    estimateFeesPerGas: async () => {
      // 20 Gwei is the standard on Botchain Mainnet
      return {
        maxPriorityFeePerGas: 20000000000n, // 20 Gwei
        maxFeePerGas: 25000000000n, // 25 Gwei
      };
    },
  },
  testnet: false,
});

// Also keep testnet for testing reference
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
      return {
        maxPriorityFeePerGas: 25000000000n, // 25 Gwei
        maxFeePerGas: 35000000000n, // 35 Gwei
      };
    },
  },
  testnet: true,
});

// Default active chain: Botchain Mainnet
export const activeChain = botchainMainnet;
