"use client";

import React, { useState } from "react";
import { Zap, ExternalLink, ShieldAlert, Globe, Copy, Check } from "lucide-react";
import Image from "next/image";
import { DARE_ME_ADDRESS } from "@/config/wagmi";

export function Footer() {
  const [copied, setCopied] = useState(false);

  const shortenAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 6)}`;
  };

  const copyContract = () => {
    navigator.clipboard.writeText(DARE_ME_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="mt-20 border-t border-charcoal-800/80 bg-charcoal-950 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Tagline */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
              <Zap className="h-5 w-5 fill-purple-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-white">DareMe</span>
                <span className="text-xs text-gray-400">— Drop a dare. Take the challenge.</span>
              </div>
              <p className="text-[11px] text-gray-400">Built on BOT Chain Mainnet</p>
            </div>
          </div>

          {/* BOT Chain Ecosystem Links (With BOT Chain Logo in front of each) */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-300">
            {/* BOT Chain Badge */}
            <div className="flex items-center space-x-2 rounded-xl border border-charcoal-700 bg-charcoal-900/80 px-3.5 py-2 shadow-sm">
              <Image
                src="/botchain-logo.jpg"
                alt="BOT Chain"
                width={16}
                height={16}
                className="rounded-full shrink-0"
              />
              <span className="font-semibold text-white">BOT Chain</span>
              <span className="text-[11px] text-gray-400">#677</span>
            </div>

            {/* BOT Chain Website Link with Logo at the front */}
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 rounded-xl border border-charcoal-800 bg-charcoal-900 px-3.5 py-2 text-gray-300 hover:border-emerald-500/40 hover:text-white transition shadow-sm"
            >
              <Image
                src="/botchain-logo.jpg"
                alt="BOT Chain Logo"
                width={16}
                height={16}
                className="rounded-full shrink-0"
              />
              <span className="font-medium">BOT Chain Website</span>
              <ExternalLink className="h-3 w-3 text-gray-500" />
            </a>

            {/* BOT Chain Explorer Link with Logo at the front */}
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 rounded-xl border border-charcoal-800 bg-charcoal-900 px-3.5 py-2 text-gray-300 hover:border-emerald-500/40 hover:text-white transition shadow-sm"
            >
              <Image
                src="/botchain-logo.jpg"
                alt="BOT Chain Logo"
                width={16}
                height={16}
                className="rounded-full shrink-0"
              />
              <span className="font-medium">BOT Chain Explorer</span>
              <ExternalLink className="h-3 w-3 text-gray-500" />
            </a>
          </div>
        </div>

        {/* Contract Address Section */}
        <div className="mt-8 pt-6 border-t border-charcoal-900/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-gray-500">Mainnet Contract:</span>
            <span className="font-mono text-purple-300 bg-charcoal-900 px-2 py-0.5 rounded-md border border-charcoal-800">
              {shortenAddress(DARE_ME_ADDRESS)}
            </span>
            <button
              onClick={copyContract}
              className="p-1 hover:text-white transition"
              title="Copy Mainnet Contract Address"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-gray-400" />
              )}
            </button>
            <a
              href={`https://scan.botchain.ai/address/${DARE_ME_ADDRESS}#code`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline flex items-center space-x-1"
            >
              <span>View on Explorer</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>

          <div className="inline-flex items-center space-x-1.5 text-gray-500 text-[11px]">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Challenges are self-reported.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
