"use client";

import React from "react";
import { Zap, ExternalLink, ShieldAlert, Globe } from "lucide-react";

export function Footer() {
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

          {/* BOT Chain Ecosystem Links (Mandatory) */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-300">
            {/* BOT Chain Badge */}
            <div className="flex items-center space-x-2 rounded-xl border border-charcoal-700 bg-charcoal-900/80 px-3.5 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">BOT Chain</span>
              <span className="text-[11px] text-gray-400">#677</span>
            </div>

            {/* BOT Chain Website Link */}
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 rounded-xl border border-charcoal-800 bg-charcoal-900 px-3.5 py-2 text-gray-300 hover:border-purple-500/40 hover:text-white transition"
            >
              <Globe className="h-3.5 w-3.5 text-purple-400" />
              <span>BOT Chain Website</span>
              <ExternalLink className="h-3 w-3 text-gray-500" />
            </a>

            {/* BOT Chain Explorer Link */}
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 rounded-xl border border-charcoal-800 bg-charcoal-900 px-3.5 py-2 text-gray-300 hover:border-purple-500/40 hover:text-white transition"
            >
              <ExternalLink className="h-3.5 w-3.5 text-purple-400" />
              <span>BOT Chain Explorer</span>
              <ExternalLink className="h-3 w-3 text-gray-500" />
            </a>
          </div>
        </div>

        {/* Disclaimer per requirement */}
        <div className="mt-8 pt-6 border-t border-charcoal-900/90 text-center">
          <div className="inline-flex items-center space-x-2 rounded-xl bg-charcoal-900/60 border border-charcoal-800 px-4 py-2 text-xs text-gray-400">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              <strong>Disclaimer:</strong> Challenges are self-reported. DareMe does not independently verify completion.
            </span>
          </div>
          <p className="mt-3 text-[11px] text-gray-400">
            © {new Date().getFullYear()} DareMe dApp. Powered by BOT Chain.
          </p>
        </div>
      </div>
    </footer>
  );
}
