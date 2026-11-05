import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const rawKey = process.env.PRIVATE_KEY?.trim() || "";
const PRIVATE_KEY = rawKey
  ? rawKey.startsWith("0x")
    ? rawKey
    : `0x${rawKey}`
  : "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    botchainMainnet: {
      url: "https://rpc.botchain.ai",
      chainId: 677,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 20000000000,
    },
  },
  etherscan: {
    apiKey: {
      botchainMainnet: "abc",
    },
    customChains: [
      {
        network: "botchainMainnet",
        chainId: 677,
        urls: {
          apiURL: "https://scan.botchain.ai/api",
          browserURL: "https://scan.botchain.ai",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
