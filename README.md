# DareMe ⚡

> **Drop a dare. Take the challenge. Prove yourself.**

DareMe is a simple, modern, decentralized challenge dApp built on **BOT Chain**. It enables users to post peer-to-peer dares, take up challenges posted by others, and self-report completion on-chain with zero centralized backend or database.

---

## 1. Network Configuration (BOT Chain)

DareMe is configured out-of-the-box for **BOT Chain Mainnet**:

| Parameter | Value |
|---|---|
| **Network Name** | BOT Chain |
| **Chain ID** | `677` |
| **RPC URL** | `https://rpc.botchain.ai` |
| **Native Currency** | BOT (`BOT`, 18 decimals) |
| **Total Supply** | 150 Million |
| **BOT Chain Website** | [https://botchain.ai](https://botchain.ai) |
| **BOT Chain Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |

---

## 2. Tech Stack

- **Smart Contracts:** Solidity (`0.8.24`)
- **Development & Testing:** Hardhat, `@nomicfoundation/hardhat-toolbox`, Ethers.js v6, Chai
- **Frontend Framework:** Next.js (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS (charcoal dark mode, muted purple accents, muted emerald success)
- **Web3 Connectivity:** Wagmi v2, Viem v2, MetaMask Injected Connector
- **Icons:** Lucide React

---

## 3. Core Features

1. **Wallet Connection:**
   - Seamless MetaMask integration via wagmi.
   - Displays shortened wallet address and connected network.
   - Auto-detects wrong networks and prompts one-click switching to BOT Chain (Chain ID `677`).

2. **Create a Dare:**
   - Post challenges with a title (max 100 chars), description (max 500 chars), and category (`Fun`, `Knowledge`, `Gaming`, `Fitness`).
   - Validates input on both client and contract level to prevent spam, empty submissions, or oversized data.

3. **Accept a Dare:**
   - Connected users can browse and accept open challenges.
   - Creators cannot accept their own dares.
   - Single-challenger model prevents race conditions; changes dare status from `OPEN` to `IN_PROGRESS`.

4. **Complete a Dare:**
   - Only the assigned participant can mark the challenge as `COMPLETED`.
   - Records timestamp on-chain.
   - Transparent disclaimer: *Challenges are self-reported. DareMe does not independently verify physical or off-chain completion.*

5. **Browse & Filter Dares:**
   - Feed tabs: **Open Dares**, **My Dares**, and **Completed Dares**.
   - Category filtering & search query support.
   - Real-time status indicators, BOT Chain Explorer links, and comprehensive loading/empty/error states.

---

## 4. Smart Contract Details

- **Contract Address:** [`0x573F227e7809620f38560a57867b068E81B45FE7`](https://scan.botchain.ai/address/0x573F227e7809620f38560a57867b068E81B45FE7)
- **Verified Source Code:** [View on BOT Chain Explorer](https://scan.botchain.ai/address/0x573F227e7809620f38560a57867b068E81B45FE7#code)

---

## 5. Running the Frontend

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```
