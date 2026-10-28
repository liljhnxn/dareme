"use client";

import React, { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { DARE_ME_ABI } from "@/contracts/dareMeAbi";
import { DARE_ME_ADDRESS, IS_CONTRACT_CONFIGURED } from "@/config/wagmi";
import { Dare, DareStatus, DareCategory } from "@/types/dare";
import { DareCard } from "./DareCard";
import {
  RotateCw,
  Search,
  Filter,
  Inbox,
  AlertCircle,
  Loader2,
  PlusCircle,
} from "lucide-react";

type FeedTab = "open" | "my" | "completed";

interface DareFeedProps {
  onCreateClick: () => void;
  onStatsUpdate: (stats: { total: number; open: number; completed: number }) => void;
  refreshTrigger: number;
}

export function DareFeed({
  onCreateClick,
  onStatsUpdate,
  refreshTrigger,
}: DareFeedProps) {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<FeedTab>("open");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Read all dares from the smart contract
  const {
    data: rawDares,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useReadContract({
    address: DARE_ME_ADDRESS,
    abi: DARE_ME_ABI,
    functionName: "getAllDares",
    query: {
      enabled: IS_CONTRACT_CONFIGURED,
    },
  });

  // Re-fetch when refreshTrigger updates
  React.useEffect(() => {
    if (IS_CONTRACT_CONFIGURED) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  // Format dares
  const dares: Dare[] = React.useMemo(() => {
    if (!rawDares || !Array.isArray(rawDares)) return [];

    const parsed: Dare[] = rawDares.map((item) => ({
      id: BigInt(item.id),
      creator: item.creator as `0x${string}`,
      participant: item.participant as `0x${string}`,
      title: item.title,
      description: item.description,
      category: item.category,
      createdAt: BigInt(item.createdAt),
      completedAt: BigInt(item.completedAt),
      status: Number(item.status) as DareStatus,
    }));

    // Update parent stats
    const total = parsed.length;
    const open = parsed.filter((d) => d.status === DareStatus.OPEN).length;
    const completed = parsed.filter((d) => d.status === DareStatus.COMPLETED).length;
    onStatsUpdate({ total, open, completed });

    // Reverse so latest dares appear first
    return [...parsed].reverse();
  }, [rawDares, onStatsUpdate]);

  // Filter based on active tab
  const filteredByTab = React.useMemo(() => {
    return dares.filter((dare) => {
      if (activeTab === "open") {
        return dare.status === DareStatus.OPEN;
      }
      if (activeTab === "completed") {
        return dare.status === DareStatus.COMPLETED;
      }
      if (activeTab === "my") {
        if (!address) return false;
        const userAddr = address.toLowerCase();
        return (
          dare.creator.toLowerCase() === userAddr ||
          dare.participant.toLowerCase() === userAddr
        );
      }
      return true;
    });
  }, [dares, activeTab, address]);

  // Filter by category and search
  const displayedDares = React.useMemo(() => {
    return filteredByTab.filter((dare) => {
      const matchesCategory =
        selectedCategory === "All" ||
        dare.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        dare.title.toLowerCase().includes(q) ||
        dare.description.toLowerCase().includes(q) ||
        dare.creator.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [filteredByTab, selectedCategory, searchQuery]);

  const categories = ["All", "Fun", "Knowledge", "Gaming", "Fitness"];

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-charcoal-800">
        {/* Tabs: Open / My Dares / Completed */}
        <div className="flex rounded-xl bg-charcoal-900 border border-charcoal-800 p-1">
          <button
            onClick={() => setActiveTab("open")}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
              activeTab === "open"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>Open Dares</span>
            <span className="rounded-full bg-charcoal-950/60 px-1.5 py-0.2 text-[10px] text-gray-300">
              {dares.filter((d) => d.status === DareStatus.OPEN).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("my")}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
              activeTab === "my"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>My Dares</span>
            {address && (
              <span className="rounded-full bg-charcoal-950/60 px-1.5 py-0.2 text-[10px] text-gray-300">
                {
                  dares.filter(
                    (d) =>
                      d.creator.toLowerCase() === address.toLowerCase() ||
                      d.participant.toLowerCase() === address.toLowerCase()
                  ).length
                }
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
              activeTab === "completed"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span>Completed Dares</span>
            <span className="rounded-full bg-charcoal-950/60 px-1.5 py-0.2 text-[10px] text-gray-300">
              {dares.filter((d) => d.status === DareStatus.COMPLETED).length}
            </span>
          </button>
        </div>

        {/* Secondary controls: Search + Category + Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search dares..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-charcoal-700 bg-charcoal-900 pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Refresh button */}
          <button
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="flex items-center space-x-1.5 rounded-xl border border-charcoal-700 bg-charcoal-900 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-charcoal-800 transition disabled:opacity-50"
            title="Refresh feed from chain"
          >
            <RotateCw
              className={`h-3.5 w-3.5 ${
                isLoading || isRefetching ? "animate-spin text-purple-400" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto py-4 scrollbar-none">
        <span className="text-xs text-gray-500 flex items-center space-x-1 mr-1">
          <Filter className="h-3 w-3" />
          <span>Category:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition shrink-0 ${
              selectedCategory === cat
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "bg-charcoal-900 border border-charcoal-800 text-gray-400 hover:text-gray-200 hover:border-charcoal-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed Content */}
      <div className="mt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-3" />
            <p className="text-sm text-gray-300">Loading challenges from Botchain Testnet...</p>
            <p className="text-xs text-gray-500 mt-1">Reading contract state at RPC: rpc.bohr.life</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="mx-auto h-8 w-8 text-rose-400 mb-3" />
            <h4 className="text-sm font-semibold text-rose-200">Failed to Load Dares</h4>
            <p className="mt-1 text-xs text-gray-400">
              Could not retrieve dare state from Botchain. Please check your network connection or verify the contract address.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-charcoal-800 border border-charcoal-700 px-4 py-2 text-xs font-medium text-gray-200 hover:bg-charcoal-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : displayedDares.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-charcoal-800 bg-charcoal-900/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-800 text-gray-500 mb-3">
              <Inbox className="h-6 w-6" />
            </div>
            <h4 className="text-base font-semibold text-gray-300">
              {activeTab === "open"
                ? "No open dares right now"
                : activeTab === "my"
                ? "You haven't created or accepted any dares yet"
                : "No completed dares yet"}
            </h4>
            <p className="mt-1 text-xs text-gray-500 max-w-sm">
              {activeTab === "open"
                ? "Be the pioneer and drop the first challenge for the community on Botchain!"
                : activeTab === "my"
                ? "Browse open dares to accept a challenge, or create one yourself!"
                : "Dares will appear here once participants mark their challenges as finished."}
            </p>
            <button
              onClick={onCreateClick}
              className="mt-6 flex items-center space-x-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create a Dare</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedDares.map((dare) => (
              <DareCard
                key={dare.id.toString()}
                dare={dare}
                onActionSuccess={() => refetch()}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

