"use client";
import React from "react";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { sepolia } from "wagmi/chains";
import { http } from "wagmi";
import { Toaster } from "sonner";
const config = getDefaultConfig({
  appName: "AI Quote Generator",
  projectId: "8a676e9208392a59542a541bd97c9298",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_ALCHEMY_RPC || "https://rpc.ankr.com/eth_sepolia"
    ),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
          <Toaster position="top-right" richColors expand={false} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
