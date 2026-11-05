import { http, createConfig } from "wagmi";
import { injected } from "@wagmi/core";
import { activeChain, botchainMainnet } from "./chain";

export const config = createConfig({
  chains: [botchainMainnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [botchainMainnet.id]: http("https://rpc.botchain.ai"),
  },
  ssr: true,
});

export const DARE_ME_ADDRESS = (process.env.NEXT_PUBLIC_DAREME_CONTRACT_ADDRESS ||
  "0x573F227e7809620f38560a57867b068E81B45FE7") as `0x${string}`;

export const IS_CONTRACT_CONFIGURED =
  Boolean(DARE_ME_ADDRESS) &&
  DARE_ME_ADDRESS.startsWith("0x") &&
  DARE_ME_ADDRESS.length === 42;
