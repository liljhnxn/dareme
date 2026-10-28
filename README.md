# DareMe ⚡

> **Drop a dare. Take the challenge. Prove yourself.**

DareMe is a simple, modern, decentralized challenge dApp built for **Botchain Testnet**. It enables users to post peer-to-peer dares, take up challenges posted by others, and self-report completion on-chain with zero centralized backend or database.

---

## 1. Network Configuration (Botchain Testnet)

DareMe is configured out-of-the-box for **Botchain Testnet**:

| Parameter | Value |
|---|---|
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC URL** | `https://rpc.bohr.life` |
| **Native Currency** | BOT (`tBOT`, 18 decimals) |
| **Block Explorer** | `https://scan.bohr.life` |

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
   - Auto-detects wrong networks and prompts one-click switching/adding of Botchain Testnet (Chain ID `968`).

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
   - Real-time status indicators, BohrScan explorer links, and comprehensive loading/empty/error states.

---

## 4. Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ or v20+ (tested on Node v25)
- [npm](https://www.npmjs.com/)
- MetaMask browser extension

### Install Dependencies

```bash
npm install
```

---

## 5. Smart Contract Testing & Compilation

### Compile Contract

```bash
npm run compile
```

This compiles `contracts/DareMe.sol` and generates TypeChain typings and artifacts.

### Run Tests

```bash
npm test
```

The test suite in `test/DareMe.test.ts` validates:
- Creating valid dares and emitting `DareCreated` events.
- Rejecting empty titles and descriptions (`EmptyTitle`, `EmptyDescription`).
- Rejecting oversized titles (> 100 bytes) and descriptions (> 500 bytes).
- Rejecting invalid categories.
- Accepting open dares and emitting `DareAccepted`.
- Preventing creators from accepting their own dares (`CreatorCannotAccept`).
- Preventing multiple users from accepting the same dare (`DareNotOpen`).
- Allowing only the assigned participant to complete a dare (`OnlyParticipantCanComplete`).
- Preventing duplicate completion (`DareNotInProgress`).
- Querying all dares via `getAllDares()`.

---

## 6. Deployment to Botchain Testnet

### Step 1: Set up Environment Variables

Create a `.env` file in the project root:

```env
PRIVATE_KEY=your_private_key_with_testnet_tbot
```

> **Security Note:** Never commit your private key to Git or expose it in frontend code.

### Step 2: Deploy Contract

```bash
npm run deploy:botchain
```

The deployment script will output:
```
====================================================
 DareMe successfully deployed!
 Contract Address: 0x...
 Network: Botchain Testnet (Chain ID: 968)
 Explorer: https://scan.bohr.life/address/0x...
====================================================
```

### Step 3: Configure Frontend

Create `.env.local` in the project root and add the deployed address:

```env
NEXT_PUBLIC_DAREME_CONTRACT_ADDRESS=0xYourDeployedContractAddressHere
```

---

## 7. Running the Frontend

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

---

## 8. Gas & Transactions on Botchain

The following on-chain actions require a small amount of testnet gas (`tBOT`):
- **Creating a Dare (`createDare`)**
- **Accepting a Dare (`acceptDare`)**
- **Completing a Dare (`completeDare`)**

The following actions are free read calls (`eth_call`):
- Browsing all dares (`getAllDares`, `getDare`, `getDareCount`)
- Checking network status and wallet address

---

## 9. Architecture & Design Principles

- **No Centralized Backend or Database:** DareMe does not use Firebase, Supabase, or external databases. All state resides on the Botchain Testnet blockchain.
- **No Payments or Staking:** Focuses purely on social Web3 challenge mechanics without monetary custody or financial risk.
- **RPC Resilience:** Uses direct contract state queries (`getAllDares()`) to avoid block-range limitations associated with RPC log filtering.
- **Truthful UX:** If the contract address is not configured in `.env.local`, a clear configuration guide is displayed rather than fabricating fake data.

