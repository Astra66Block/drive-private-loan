# Drive Private Loan

A privacy-preserving vehicle financing platform built with Fully Homomorphic Encryption (FHE) technology for secure RWA (Real World Assets) tokenization.

## Features

- **Private Vehicle Financing**: Encrypted loan terms and financial data protection
- **RWA Tokenization**: Secure tokenization of vehicle assets with FHE encryption
- **Real-time Analytics**: Live financing dashboard with encrypted data processing
- **Wallet Integration**: Secure wallet connection for authenticated access
- **Modern UI**: Responsive interface with advanced visualizations

## Technologies

This project is built with:

- **Frontend**: Vite, TypeScript, React, shadcn-ui, Tailwind CSS
- **Blockchain**: Solidity smart contracts with FHE encryption
- **Privacy**: Fully Homomorphic Encryption for sensitive data protection
- **Wallet**: RainbowKit, Wagmi, Viem for wallet integration
- **Deployment**: Vercel-ready configuration

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone https://github.com/Astra66Block/drive-private-loan.git

# Navigate to the project directory
cd drive-private-loan

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Smart Contract Integration

The platform integrates with FHE-enabled smart contracts for:
- Encrypted vehicle financing data
- Private loan analytics
- Secure user authentication
- Protected financial metrics

## Environment Variables

Create a `.env.local` file with the following variables:

```env
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
VITE_INFURA_API_KEY=your_infura_api_key
```

## Deployment

The project is configured for easy deployment on Vercel:

```sh
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## Privacy & Security

All sensitive financial data is encrypted using Fully Homomorphic Encryption, ensuring:
- Data privacy while maintaining computational capabilities
- Secure analytics without exposing raw values
- Compliance with financial privacy regulations
