import { http, createConfig } from "wagmi";
import { injected } from "@wagmi/core";
import { botchainTestnet } from "./chain";

export const config = createConfig({
  chains: [botchainTestnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [botchainTestnet.id]: http("https://rpc.bohr.life"),
  },
  ssr: true,
});

export const DARE_ME_ADDRESS = (process.env.NEXT_PUBLIC_DAREME_CONTRACT_ADDRESS ||
  "") as `0x${string}`;

export const IS_CONTRACT_CONFIGURED =
  Boolean(DARE_ME_ADDRESS) &&
  DARE_ME_ADDRESS.startsWith("0x") &&
  DARE_ME_ADDRESS.length === 42;
