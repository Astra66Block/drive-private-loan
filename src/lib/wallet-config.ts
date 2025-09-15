import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

// Configure supported chains for FHE network
export const config = getDefaultConfig({
  appName: 'Drive Private Loan',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '2ec9743d0d0cd7fb94dee1a7e6d33475',
  chains: [sepolia, mainnet], // Add FHE network when available
  ssr: false, // If your dApp uses server side rendering (SSR)
});

// FHE Network Configuration (when available)
export const fheNetworkConfig = {
  chainId: 42069, // Example FHE network chain ID
  name: 'FHE Network',
  nativeCurrency: {
    decimals: 18,
    name: 'FHE',
    symbol: 'FHE',
  },
  rpcUrls: {
    default: { http: ['https://rpc.fhenix.xyz'] },
    public: { http: ['https://rpc.fhenix.xyz'] },
  },
  blockExplorers: {
    default: { name: 'FHE Explorer', url: 'https://explorer.fhenix.xyz' },
  },
};

// Contract addresses (to be updated after deployment)
export const contractAddresses = {
  vehicleLoan: '0x...', // Will be set after contract deployment
  fheToken: '0x...', // FHE token contract address
};

// FHE SDK Configuration
export const fheConfig = {
  network: 'sepolia', // or 'mainnet' when available
  rpcUrl: 'https://rpc.fhenix.xyz',
  // Add other FHE-specific configuration
};
