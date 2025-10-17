# 🖼 QuoteNFT Frontend

[![License: MIT](https://img.shields.io/github/license/Francisbello87/quoteNFT_frontend?color=blue)](LICENSE)  
[![Last Commit](https://img.shields.io/github/last-commit/Francisbello87/quoteNFT_frontend?color=brightgreen)](https://github.com/Francisbello87/quoteNFT_frontend/commits/main)  
[![Stars](https://img.shields.io/github/stars/Francisbello87/quoteNFT_frontend?style=social)](https://github.com/Francisbello87/quoteNFT_frontend/stargazers)  
[![Forks](https://img.shields.io/github/forks/Francisbello87/quoteNFT_frontend?style=social)](https://github.com/Francisbello87/quoteNFT_frontend/network/members)

> Frontend application for the **QuoteNFT** system — built with **Next.js / React (TypeScript)**, connecting to your smart contract interface.

---

## 🧠 Project Overview

**QuoteNFT Frontend** serves as the user interface for the QuoteNFT ecosystem — a fully on-chain NFT platform for minting, viewing, and managing quote-based NFTs.  
It interacts seamlessly with the deployed **QuoteNFT Smart Contract**, providing a smooth, responsive, and wallet-integrated Web3 experience.  

This app allows users to:  
- Connect their wallet (e.g. MetaMask)  
- Mint NFTs representing quotes or text content  
- View their minted NFTs  
- Interact directly with the blockchain through an intuitive UI  

---
## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)  
- npm, yarn or pnpm  
- The `quoteNFT_contract` deployed address & ABI  
- A wallet / provider (e.g. MetaMask) for interacting with the contract  

---

### Installation

```bash
git clone https://github.com/Francisbello87/quoteNFT_frontend.git
cd quoteNFT_frontend
npm install
```
--- 

### Configuration

Create a `.env.local` (or `.env`) file in the root and add:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=<your_deployed_contract_address>
NEXT_PUBLIC_RPC_URL=<your_rpc_provider_url>
```

You may also need to configure network, keys, etc. depending on your frontend integration.

---

### Development

Start the dev server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open http://localhost:3000 in your browser to view the app.  
Modify `app/page.tsx` or other components — changes hot-reload automatically.

---

### Testing (if applicable)

If you add frontend tests (Jest, React Testing Library), include:
```bash
npm test
```

And configure a GitHub workflow `test.yml` so your Tests badge works properly.

---

### Build & Deployment

To build for production:

```bash
npm run build
npm run start
```

You can deploy to platforms like **Vercel**, **Netlify**, or your preferred hosting.  
Example (Vercel):

- Connect your GitHub repo  
- Set environment variables  
- Deploy directly  

---

### 🧰 Tools & Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Next.js** | React framework for SSR / app structure |
| **TypeScript** | Static typing for safety |
| **React** | UI library |
| **Ethers.js / Web3.js** | For blockchain interaction |
| **Tailwind CSS / CSS Modules / Your CSS approach** | Styling |
| **Vercel / Netlify** | Hosting & deployment |

---

### 🪪 License

This project is licensed under the [MIT License](LICENSE) for details.

---

### 💡 Author

**Francis Bello**  
[GitHub](https://github.com/Francisbello87) • [Twitter](https://x.com/Francis_coder)
