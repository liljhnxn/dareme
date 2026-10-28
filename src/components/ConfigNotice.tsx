"use client";

import React from "react";
import { AlertTriangle, Terminal, ArrowRight, Code } from "lucide-react";

export function ConfigNotice() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-amber-200">
              Contract Address Not Configured
            </h3>
            <p className="mt-1 text-sm text-gray-300">
              The DareMe smart contract is not yet configured in this frontend. Follow these quick steps to deploy and activate the application on Botchain Testnet:
            </p>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-charcoal-950/80 border border-charcoal-800 p-3.5 text-xs">
                <div className="flex items-center space-x-2 text-purple-400 font-semibold mb-1">
                  <Terminal className="h-4 w-4" />
                  <span>Step 1: Set your deployer private key in .env</span>
                </div>
                <code className="text-gray-300 font-mono text-[11px] block pl-6">
                  PRIVATE_KEY=your_botchain_testnet_private_key
                </code>
              </div>

              <div className="rounded-xl bg-charcoal-950/80 border border-charcoal-800 p-3.5 text-xs">
                <div className="flex items-center space-x-2 text-purple-400 font-semibold mb-1">
                  <Terminal className="h-4 w-4" />
                  <span>Step 2: Deploy to Botchain Testnet (Chain ID 968)</span>
                </div>
                <code className="text-gray-300 font-mono text-[11px] block pl-6">
                  npm run deploy:botchain
                </code>
              </div>

              <div className="rounded-xl bg-charcoal-950/80 border border-charcoal-800 p-3.5 text-xs">
                <div className="flex items-center space-x-2 text-purple-400 font-semibold mb-1">
                  <Terminal className="h-4 w-4" />
                  <span>Step 3: Update .env.local with deployed contract address</span>
                </div>
                <code className="text-gray-300 font-mono text-[11px] block pl-6">
                  NEXT_PUBLIC_DAREME_CONTRACT_ADDRESS=0x...
                </code>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              Once configured, restart the Next.js development server or reload the page to interact with DareMe on Botchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

