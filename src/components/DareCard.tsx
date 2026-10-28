"use client";

import React, { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { Dare, DareStatus } from "@/types/dare";
import { DARE_ME_ABI } from "@/contracts/dareMeAbi";
import { DARE_ME_ADDRESS } from "@/config/wagmi";
import { botchainTestnet } from "@/config/chain";
import {
  Clock,
  User,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Loader2,
  AlertCircle,
  Zap,
} from "lucide-react";

interface DareCardProps {
  dare: Dare;
  onActionSuccess: () => void;
}

export function DareCard({ dare, onActionSuccess }: DareCardProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  const [localError, setLocalError] = useState<string | null>(null);

  const {
    writeContract,
    data: txHash,
    isPending: isSubmitting,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isWaitingReceipt, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Call parent refresh when confirmed
  React.useEffect(() => {
    if (isConfirmed) {
      onActionSuccess();
      resetWrite();
      setLocalError(null);
    }
  }, [isConfirmed, onActionSuccess, resetWrite]);

  const isBusy = isSubmitting || isWaitingReceipt;

  const shortenAddress = (addr: string) => {
    if (!addr || addr === "0x0000000000000000000000000000000000000000") return "None";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const formatDate = (timestampBigInt: bigint) => {
    if (!timestampBigInt || timestampBigInt === 0n) return "";
    const date = new Date(Number(timestampBigInt) * 1000);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isCreator =
    address && dare.creator.toLowerCase() === address.toLowerCase();
  const isParticipant =
    address && dare.participant.toLowerCase() === address.toLowerCase();

  const handleAccept = () => {
    setLocalError(null);
    if (!isConnected) {
      setLocalError("Please connect your MetaMask wallet first.");
      return;
    }
    if (isWrongNetwork) {
      setLocalError("Please switch to Botchain Testnet (Chain ID 968).");
      return;
    }
    if (isCreator) {
      setLocalError("You cannot accept your own dare.");
      return;
    }

    writeContract({
      address: DARE_ME_ADDRESS,
      abi: DARE_ME_ABI,
      functionName: "acceptDare",
      args: [dare.id],
      maxPriorityFeePerGas: 25000000000n, // 25 Gwei (exceeds Botchain's 20 Gwei min)
      maxFeePerGas: 35000000000n, // 35 Gwei
    });
  };

  const handleComplete = () => {
    setLocalError(null);
    if (!isConnected) {
      setLocalError("Please connect your MetaMask wallet first.");
      return;
    }
    if (isWrongNetwork) {
      setLocalError("Please switch to Botchain Testnet (Chain ID 968).");
      return;
    }
    if (!isParticipant) {
      setLocalError("Only the assigned participant can mark this dare completed.");
      return;
    }

    writeContract({
      address: DARE_ME_ADDRESS,
      abi: DARE_ME_ABI,
      functionName: "completeDare",
      args: [dare.id],
      maxPriorityFeePerGas: 25000000000n, // 25 Gwei (exceeds Botchain's 20 Gwei min)
      maxFeePerGas: 35000000000n, // 35 Gwei
    });
  };

  // Status Badge Colors & Labels
  const getStatusBadge = () => {
    switch (dare.status) {
      case DareStatus.OPEN:
        return (
          <span className="inline-flex items-center space-x-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>Open</span>
          </span>
        );
      case DareStatus.IN_PROGRESS:
        return (
          <span className="inline-flex items-center space-x-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span>In Progress</span>
          </span>
        );
      case DareStatus.COMPLETED:
        return (
          <span className="inline-flex items-center space-x-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
            <CheckCircle className="h-3 w-3 text-emerald-400" />
            <span>Completed</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "fitness":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
      case "gaming":
        return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
      case "knowledge":
        return "border-violet-500/30 bg-violet-500/10 text-violet-300";
      case "fun":
      default:
        return "border-pink-500/30 bg-pink-500/10 text-pink-300";
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-charcoal-700/80 bg-charcoal-900/90 p-5 shadow-lg hover:border-purple-500/30 transition duration-200">
      <div>
        {/* Top bar: Category + Status */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-charcoal-800">
          <span
            className={`rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase ${getCategoryBadgeClass(
              dare.category
            )}`}
          >
            {dare.category}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-gray-500">#{dare.id.toString()}</span>
            {getStatusBadge()}
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-lg font-bold text-white group-hover:text-purple-200 transition">
          {dare.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed line-clamp-4">
          {dare.description}
        </p>

        {/* Metadata info */}
        <div className="mt-4 space-y-1.5 text-xs text-gray-400 pt-3 border-t border-charcoal-800/80">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1 text-gray-400">
              <User className="h-3.5 w-3.5" />
              <span>Creator:</span>
            </span>
            <a
              href={`https://scan.bohr.life/address/${dare.creator}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-purple-400 hover:text-purple-300 hover:underline flex items-center space-x-1"
            >
              <span>{isCreator ? "You (creator)" : shortenAddress(dare.creator)}</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>

          {dare.status !== DareStatus.OPEN && (
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1 text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Challenger:</span>
              </span>
              <a
                href={`https://scan.bohr.life/address/${dare.participant}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-gray-300 hover:text-purple-300 hover:underline flex items-center space-x-1"
              >
                <span>{isParticipant ? "You (participant)" : shortenAddress(dare.participant)}</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1 text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>Created:</span>
            </span>
            <span className="text-gray-400 font-mono text-[11px]">{formatDate(dare.createdAt)}</span>
          </div>

          {dare.status === DareStatus.COMPLETED && dare.completedAt > 0n && (
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1 text-emerald-400/80">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Completed:</span>
              </span>
              <span className="text-emerald-400 font-mono text-[11px]">
                {formatDate(dare.completedAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Section */}
      <div className="mt-5 pt-3 border-t border-charcoal-800">
        {/* Error message */}
        {(localError || writeError) && (
          <div className="mb-3 flex items-start space-x-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 p-2 text-xs text-rose-300">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <p className="line-clamp-2">
              {localError ||
                (writeError?.message.includes("User rejected")
                  ? "Transaction cancelled in wallet."
                  : writeError?.message)}
            </p>
          </div>
        )}

        {/* Tx Pending Notice */}
        {txHash && (
          <div className="mb-3 flex items-center justify-between rounded-lg bg-purple-500/10 border border-purple-500/20 p-2 text-xs text-purple-300">
            <div className="flex items-center space-x-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Confirming on Botchain...</span>
            </div>
            <a
              href={`https://scan.bohr.life/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[11px] flex items-center space-x-0.5"
            >
              <span>Scan</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        )}

        {/* Buttons by Status */}
        {dare.status === DareStatus.OPEN && (
          <div>
            {isCreator ? (
              <button
                disabled
                className="w-full rounded-xl border border-charcoal-700 bg-charcoal-850 px-4 py-2.5 text-xs font-medium text-gray-500 cursor-not-allowed"
              >
                You Created This Dare
              </button>
            ) : (
              <button
                onClick={handleAccept}
                disabled={isBusy}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-purple-500 active:scale-98 transition disabled:opacity-50"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Accepting...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5" />
                    <span>Accept Dare</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {dare.status === DareStatus.IN_PROGRESS && (
          <div>
            {isParticipant ? (
              <button
                onClick={handleComplete}
                disabled={isBusy}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-emerald-500 active:scale-98 transition disabled:opacity-50"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Marking Complete...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Mark as Completed</span>
                  </>
                )}
              </button>
            ) : (
              <div className="w-full rounded-xl border border-charcoal-700 bg-charcoal-850 px-4 py-2 text-center text-xs text-gray-400">
                In progress by <span className="font-mono text-gray-300">{shortenAddress(dare.participant)}</span>
              </div>
            )}
          </div>
        )}

        {dare.status === DareStatus.COMPLETED && (
          <div className="w-full flex items-center justify-center space-x-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-center text-xs font-medium text-emerald-300">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span>Dare Completed</span>
          </div>
        )}
      </div>
    </div>
  );
}

