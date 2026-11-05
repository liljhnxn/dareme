# DareMe — Whitepaper & Project Overview
**Tagline:** Drop a dare. Take the challenge. Prove yourself.  
**Network:** BOT Chain Mainnet (Chain ID: `677`)  
**Contract Address:** `0x573F227e7809620f38560a57867b068E81B45FE7`  
**Explorer:** [https://scan.botchain.ai/address/0x573F227e7809620f38560a57867b068E81B45FE7#code](https://scan.botchain.ai/address/0x573F227e7809620f38560a57867b068E81B45FE7#code)  
**BOT Chain Website:** [https://botchain.ai](https://botchain.ai)  
**BOT Chain Explorer:** [https://scan.botchain.ai](https://scan.botchain.ai)  
**Repository:** [https://github.com/liljhnxn/dareme](https://github.com/liljhnxn/dareme)  

---

## 1. Executive Summary

**DareMe** is a decentralized, peer-to-peer social challenge protocol deployed live on **BOT Chain Mainnet**. It enables users to post open challenges ("dares"), accept challenges posted by others, and self-report completion directly on-chain. 

DareMe removes the friction, censorship, and data-mining of traditional Web2 challenge platforms by relying entirely on verifiable smart contracts, requiring no centralized database, traditional accounts, or third-party custody.

---

## 2. Problem Statement

1. **Centralization & Censorship:** Web2 social challenge platforms rely on centralized databases, ad-driven algorithms, and opaque moderation policies.
2. **Custody & Privacy Risks:** Most social apps force users to create centralized accounts tied to personal phone numbers, emails, and identity graphs.
3. **Overcomplicated Web3 Apps:** Many decentralized applications introduce unnecessary tokens, complex staking mechanisms, and volatile financial incentives that detract from pure user engagement and community fun.

---

## 3. The DareMe Solution

DareMe offers a clean, zero-custody, minimal Web3 dApp centered around community engagement:

- **100% On-Chain State:** Every dare, participation, and completion timestamp lives immutably on the BOT Chain ledger.
- **Pure Wallet Identity:** Users interact natively with their MetaMask wallet address. No passwords, KYC, or private data collection.
- **Fair Participation Mechanics:** Custom smart contract logic guarantees that creators cannot accept their own dares and dares cannot be claimed simultaneously by multiple participants.
- **Lightweight & Accessible:** Zero platform tokens, speculative tokens, or payment barriers. Simple native gas (`BOT`) powers interactions.

---

## 4. Technical Specifications

- **Smart Contract:** Solidity `0.8.24` (`DareMe.sol`) optimized with 200 compiler runs.
- **Contract Address:** `0x573F227e7809620f38560a57867b068E81B45FE7` (Verified)
- **Frontend Stack:** Next.js (App Router), React 18, TypeScript, Tailwind CSS.
- **Web3 Connectivity:** Wagmi v2, Viem v2, MetaMask injected provider.
- **Network Parameters:**
  - Chain: BOT Chain
  - Chain ID: `677`
  - RPC URL: `https://rpc.botchain.ai`
  - Explorer: `https://scan.botchain.ai`
  - Native Token: `BOT`

---

## 5. Smart Contract Security & Integrity

- **Spam Prevention:** Strict text length limits prevent transaction bloat and minimize gas expenditure.
- **Reentrancy & Custody Immunity:** The contract neither accepts nor holds funds, eliminating exploit vectors related to monetary drainage.
- **Access Control:** Custom errors (`CreatorCannotAccept`, `DareNotOpen`, `OnlyParticipantCanComplete`, `DareNotInProgress`) enforce strict caller checks at the bytecode level.
- **Transparent Self-Reporting:** DareMe explicitly informs users that completion is self-reported, establishing transparent expectations.
