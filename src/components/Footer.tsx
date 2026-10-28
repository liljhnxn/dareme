"use client";

import React from "react";
import { Zap, ExternalLink, ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-charcoal-800/80 bg-charcoal-950 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Tagline */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
              <Zap className="h-4 w-4 fill-purple-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-white">DareMe</span>
                <span className="text-xs text-gray-400">— Drop a dare. Take the challenge.</span>
              </div>
              <p className="text-[11px] text-gray-400">Peer-to-peer Web3 challenge protocol</p>
            </div>
          </div>

          {/* Network Details */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center space-x-1.5 rounded-lg border border-charcoal-800 bg-charcoal-900 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Botchain Testnet (Chain ID 968)</span>
            </div>

            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 underline"
            >
              <span>BohrScan Explorer</span>
              <ExternalLink className="h-3 w-3" />
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
            © {new Date().getFullYear()} DareMe dApp. Built for Botchain Testnet.
          </p>
        </div>
      </div>
    </footer>
  );
}

