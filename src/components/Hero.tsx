"use client";

import React, { useState } from "react";
import { PlusCircle, Flame, ExternalLink, Copy, Check } from "lucide-react";
import Image from "next/image";
import { DARE_ME_ADDRESS } from "@/config/wagmi";

interface HeroProps {
  onCreateClick: () => void;
  totalDares: number;
  openDares: number;
  completedDares: number;
}

export function Hero({
  onCreateClick,
  totalDares,
  openDares,
  completedDares,
}: HeroProps) {
  const [copied, setCopied] = useState(false);

  const shortenAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const copyContract = () => {
    navigator.clipboard.writeText(DARE_ME_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-10 border-b border-charcoal-800/60">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        {/* Network & Ecosystem Pill with BOT Chain Logo */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 mb-6 backdrop-blur-sm">
          <Image
            src="/botchain-logo.jpg"
            alt="BOT Chain Logo"
            width={18}
            height={18}
            className="rounded-full shrink-0"
          />
          <span className="font-semibold text-white">BOT Chain Mainnet</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">Chain ID 677</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          Got the guts?
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-gray-400 font-normal">
          Drop a dare. Take the challenge. Prove yourself on-chain.
        </p>

        {/* Contract Address Badge */}
        <div className="mt-5 inline-flex items-center space-x-2 rounded-xl border border-charcoal-800 bg-charcoal-900/90 px-3.5 py-1.5 text-xs text-gray-300 shadow-sm backdrop-blur-sm">
          <span className="text-gray-500 font-medium">Contract:</span>
          <span className="font-mono text-purple-300">{shortenAddress(DARE_ME_ADDRESS)}</span>
          <button
            onClick={copyContract}
            className="p-1 hover:text-white transition"
            title="Copy Contract Address"
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
            className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 pl-1 border-l border-charcoal-700 hover:underline"
          >
            <span>Verified Code</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onCreateClick}
            className="flex items-center space-x-2 rounded-xl bg-purple-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-purple-900/40 hover:bg-purple-500 active:scale-95 transition"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create a Dare</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto">
          <div className="rounded-xl border border-charcoal-800 bg-charcoal-900/60 p-3 sm:p-4 backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">{totalDares}</div>
            <div className="text-[11px] sm:text-xs text-gray-400 mt-1 flex items-center justify-center space-x-1">
              <span>Total Dares</span>
            </div>
          </div>

          <div className="rounded-xl border border-charcoal-800 bg-charcoal-900/60 p-3 sm:p-4 backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold text-purple-400 font-mono">{openDares}</div>
            <div className="text-[11px] sm:text-xs text-gray-400 mt-1 flex items-center justify-center space-x-1">
              <span>Open Dares</span>
            </div>
          </div>

          <div className="rounded-xl border border-charcoal-800 bg-charcoal-900/60 p-3 sm:p-4 backdrop-blur-sm">
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">{completedDares}</div>
            <div className="text-[11px] sm:text-xs text-gray-400 mt-1 flex items-center justify-center space-x-1">
              <span>Completed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
