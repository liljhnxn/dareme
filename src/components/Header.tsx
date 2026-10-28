"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from "wagmi";
import { botchainTestnet } from "@/config/chain";
import { Zap, Wallet, AlertTriangle, CheckCircle2, ChevronDown, LogOut, Copy, Check } from "lucide-react";

export function Header() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  const shortenAddress = (addr?: string) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = () => {
    const metaMaskConnector =
      connectors.find((c) => c.id === "metaMask" || c.name.toLowerCase().includes("metamask")) ||
      connectors[0];

    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal-800/80 bg-charcoal-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400 shadow-inner">
            <Zap className="h-5 w-5 fill-purple-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">DareMe</span>
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-300 border border-purple-500/20">
                dApp
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">Drop a dare. Take the challenge.</p>
          </div>
        </div>

        {/* Network & Wallet Controls */}
        <div className="flex items-center space-x-3">
          {/* Network Indicator */}
          {isConnected && (
            <div>
              {isWrongNetwork ? (
                <button
                  onClick={() => switchChain({ chainId: botchainTestnet.id })}
                  disabled={isSwitching}
                  className="flex items-center space-x-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition"
                  title="Click to switch to Botchain Testnet"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  <span>{isSwitching ? "Switching..." : "Switch to Botchain (968)"}</span>
                </button>
              ) : (
                <div className="hidden sm:flex items-center space-x-1.5 rounded-lg border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Botchain Testnet</span>
                  <span className="text-gray-500 text-[10px]">#968</span>
                </div>
              )}
            </div>
          )}

          {/* Connect / User Button */}
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center space-x-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 active:scale-95 transition shadow-sm hover:shadow-purple-900/30 disabled:opacity-50"
            >
              <Wallet className="h-4 w-4" />
              <span>{isConnecting ? "Connecting..." : "Connect MetaMask"}</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 rounded-xl border border-charcoal-700 bg-charcoal-850 px-3 py-2 text-sm font-medium text-gray-200 hover:border-purple-500/40 hover:bg-charcoal-800 transition"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-mono">{shortenAddress(address)}</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 z-50 w-56 rounded-xl border border-charcoal-700 bg-charcoal-900 p-2 shadow-2xl">
                    <div className="px-3 py-2 border-b border-charcoal-800">
                      <p className="text-[11px] text-gray-400">Connected Wallet</p>
                      <p className="text-xs font-mono text-gray-200 truncate">{address}</p>
                    </div>

                    <button
                      onClick={copyAddress}
                      className="mt-1.5 flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs text-gray-300 hover:bg-charcoal-800 transition"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied Address!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-gray-400" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://scan.bohr.life/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs text-gray-300 hover:bg-charcoal-800 transition"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-gray-400" />
                      <span>View on BohrScan</span>
                    </a>

                    <button
                      onClick={() => {
                        disconnect();
                        setDropdownOpen(false);
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 transition"
                    >
                      <LogOut className="h-3.5 w-3.5 text-rose-400" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Network Alert Bar if on wrong network */}
      {isWrongNetwork && (
        <div className="bg-amber-950/40 border-t border-amber-500/20 px-4 py-2 text-center text-xs text-amber-200">
          <span>You are connected to an unsupported network. Please </span>
          <button
            onClick={() => switchChain({ chainId: botchainTestnet.id })}
            className="font-semibold underline hover:text-amber-100"
          >
            switch to Botchain Testnet (Chain ID 968)
          </button>
          <span> to interact with DareMe.</span>
        </div>
      )}

      {/* Connection error notice */}
      {connectError && (
        <div className="bg-rose-950/40 border-t border-rose-500/20 px-4 py-2 text-center text-xs text-rose-200">
          Wallet connection failed: {connectError.message}
        </div>
      )}
    </header>
  );
}

