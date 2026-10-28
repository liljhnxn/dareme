"use client";

import React, { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { DARE_ME_ABI } from "@/contracts/dareMeAbi";
import { DARE_ME_ADDRESS, IS_CONTRACT_CONFIGURED } from "@/config/wagmi";
import { botchainTestnet } from "@/config/chain";
import { X, Sparkles, AlertCircle, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import { DareCategory } from "@/types/dare";

interface CreateDareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES: { label: DareCategory; desc: string; icon: string }[] = [
  { label: "Fun", desc: "Lighthearted, social & goofy challenges", icon: "🎉" },
  { label: "Knowledge", desc: "Riddles, trivia & memory tests", icon: "🧠" },
  { label: "Gaming", desc: "Speedruns, score attacks & boss fights", icon: "🎮" },
  { label: "Fitness", desc: "Push-ups, planks & physical feats", icon: "⚡" },
];

export function CreateDareModal({ isOpen, onClose, onSuccess }: CreateDareModalProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<DareCategory>("Fun");
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    writeContract,
    data: txHash,
    isPending: isSubmitting,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isWaitingReceipt,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  if (!isOpen) return null;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle) {
      setValidationError("Please enter a title for your dare.");
      return;
    }
    if (trimmedTitle.length > 100) {
      setValidationError("Title must not exceed 100 characters.");
      return;
    }
    if (!trimmedDesc) {
      setValidationError("Please enter a description of the challenge.");
      return;
    }
    if (trimmedDesc.length > 500) {
      setValidationError("Description must not exceed 500 characters.");
      return;
    }

    if (!IS_CONTRACT_CONFIGURED) {
      setValidationError(
        "DareMe contract address is not configured yet. Please configure NEXT_PUBLIC_DAREME_CONTRACT_ADDRESS in .env.local."
      );
      return;
    }

    if (!isConnected) {
      setValidationError("Please connect your MetaMask wallet first.");
      return;
    }

    if (isWrongNetwork) {
      setValidationError("Please switch to Botchain Testnet (Chain ID 968) before publishing.");
      return;
    }

    writeContract({
      address: DARE_ME_ADDRESS,
      abi: DARE_ME_ABI,
      functionName: "createDare",
      args: [trimmedTitle, trimmedDesc, category],
      maxPriorityFeePerGas: 25000000000n, // 25 Gwei (exceeds Botchain's 20 Gwei min)
      maxFeePerGas: 35000000000n, // 35 Gwei
    });
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setValidationError(null);
    resetWrite();
    onClose();
    if (isConfirmed) {
      onSuccess();
    }
  };

  const isBusy = isSubmitting || isWaitingReceipt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={isBusy ? undefined : handleClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-charcoal-700 bg-charcoal-900 p-6 shadow-2xl z-10 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-purple-600/15 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Drop a New Dare</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isBusy}
            className="rounded-lg p-1 text-gray-400 hover:bg-charcoal-800 hover:text-white transition disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {isConfirmed ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Dare Published on Botchain!</h3>
            <p className="mt-2 text-sm text-gray-400">
              Your challenge is now live and waiting for a brave participant.
            </p>

            {txHash && (
              <a
                href={`https://scan.bohr.life/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 mt-4 text-xs font-medium text-purple-400 hover:text-purple-300 underline"
              >
                <span>View Transaction on BohrScan</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            <div className="mt-6">
              <button
                onClick={handleClose}
                className="w-full rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 transition"
              >
                Close & View Feed
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="mt-4 space-y-4">
            {/* Title */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-gray-300 mb-1.5">
                <label htmlFor="title">Dare Title</label>
                <span className={`text-[11px] ${title.length > 90 ? "text-amber-400" : "text-gray-500"}`}>
                  {title.length}/100
                </span>
              </div>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                placeholder="e.g. Do 10 push-ups on camera"
                disabled={isBusy}
                className="w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-gray-300 mb-1.5">
                <label htmlFor="description">Challenge Description & Rules</label>
                <span className={`text-[11px] ${description.length > 450 ? "text-amber-400" : "text-gray-500"}`}>
                  {description.length}/500
                </span>
              </div>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                placeholder="Describe the dare clearly so participants know exactly what to do..."
                disabled={isBusy}
                className="w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setCategory(cat.label)}
                    disabled={isBusy}
                    className={`flex items-start space-x-2.5 rounded-xl border p-2.5 text-left transition ${
                      category === cat.label
                        ? "border-purple-500 bg-purple-500/10 text-white"
                        : "border-charcoal-700 bg-charcoal-850/60 text-gray-400 hover:border-charcoal-600 hover:text-gray-200"
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <div>
                      <div className="text-xs font-semibold">{cat.label}</div>
                      <div className="text-[10px] text-gray-400 leading-tight mt-0.5">{cat.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Validation & Errors */}
            {validationError && (
              <div className="flex items-center space-x-2 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {writeError && (
              <div className="flex items-start space-x-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Transaction Error</p>
                  <p className="mt-0.5 line-clamp-3">
                    {writeError.message.includes("User rejected")
                      ? "Transaction was rejected in MetaMask."
                      : writeError.message}
                  </p>
                </div>
              </div>
            )}

            {receiptError && (
              <div className="flex items-center space-x-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Confirmation failed: {receiptError.message}</span>
              </div>
            )}

            {/* Transaction Pending Info */}
            {txHash && !isConfirmed && (
              <div className="flex items-center justify-between rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 text-xs text-purple-300">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Waiting for Botchain confirmation...</span>
                </div>
                <a
                  href={`https://scan.bohr.life/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 underline hover:text-purple-200"
                >
                  <span>Explorer</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isBusy}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-500 active:scale-98 transition disabled:opacity-50"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>
                      {isWaitingReceipt ? "Confirming on Botchain..." : "Confirm in MetaMask..."}
                    </span>
                  </>
                ) : (
                  <span>Publish Dare</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

