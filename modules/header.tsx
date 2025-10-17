"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-b-border sticky top-0 bg-background z-50">
      <Link
        href="/"
        className="md:text-xl font-bold text-text hover:text-white transition-colors duration-200 ease-out"
      >
        AI Quote NFT
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/nfts"
          className="px-4 py-2 text-sm font-medium text-text hover:text-white transition-colors duration-200 ease-out"
        >
          Minted NFTs
        </Link>
        <ConnectButton />
      </div>
    </div>
  );
}
