"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { QUOTE_NFT_ADDRESS } from "@/lib/contract";
import Link from "next/link";
import { AlchemyNFTResponse, AlchemyNFT, ProcessedNFT } from "@/lib/types";


type TabType = "all" | "my-nfts";

export default function NFTsPage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [allNfts, setAllNfts] = useState<ProcessedNFT[]>([]);
  const [myNfts, setMyNfts] = useState<ProcessedNFT[]>([]);
  const [loading, setLoading] = useState(true);



  const getImageUrl = (ipfsUri: string): string => {
    if (!ipfsUri) return "/placeholder.png";
    if (ipfsUri.startsWith("ipfs://")) {
      return `https://ipfs.io/ipfs/${ipfsUri.replace("ipfs://", "")}`;
    }
    return ipfsUri;
  };

  const processNFT = (nft: AlchemyNFT, owner?: string): ProcessedNFT => {
    return {
      tokenId: parseInt(nft.id.tokenId, 16),
      tokenURI: nft.tokenUri.raw,
      metadata: nft.metadata,
      imageUrl: getImageUrl(nft.metadata.image),
      owner,
      mintedAt: nft.timeLastUpdated,
    };
  };

  const fetchAllNFTs = async () => {
    try {
      const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC;
      if (!alchemyUrl) {
        console.error("Alchemy RPC not configured");
        return;
      }

      const response = await fetch(
        `${alchemyUrl}/getNFTsForContract?contractAddress=${QUOTE_NFT_ADDRESS}&withMetadata=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.nfts && data.nfts.length > 0) {
        const nftList: ProcessedNFT[] = data.nfts.map((nft: AlchemyNFT) =>
          processNFT(nft)
        );
        setAllNfts(nftList);
      } else {
        setAllNfts([]);
      }
    } catch (error) {
      console.error("Error fetching all NFTs:", error);
      setAllNfts([]);
    }
  };

  const fetchMyNFTs = async () => {
    if (!address || !isConnected) {
      setMyNfts([]);
      return;
    }

    try {
      const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC;
      if (!alchemyUrl) {
        console.error("Alchemy RPC not configured");
        return;
      }

      const response = await fetch(
        `${alchemyUrl}/getNFTsForOwner?owner=${address}&contractAddresses[]=${QUOTE_NFT_ADDRESS}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data: AlchemyNFTResponse = await response.json();

      if (data.ownedNfts && data.ownedNfts.length > 0) {
        const nftList: ProcessedNFT[] = data.ownedNfts.map((nft: AlchemyNFT) =>
          processNFT(nft, address)
        );
        setMyNfts(nftList);
      } else {
        setMyNfts([]);
      }
    } catch (error) {
      console.error("Error fetching my NFTs:", error);
      setMyNfts([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAllNFTs(), fetchMyNFTs()]);
      setLoading(false);
    };

    fetchData();
  }, [address, isConnected]);

  const displayNfts = activeTab === "all" ? allNfts : myNfts;

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Minted NFTs</h1>
          <Link
            href="/"
            className="relative inline-flex items-center justify-center px-6 py-2.5 
             rounded-xl border border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
             text-white text-sm font-medium transition-all duration-300
             hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] 
             active:scale-[0.98] group"
          >
            <span
              className="absolute inset-[1px] rounded-xl bg-[#0E0C15] group-hover:bg-gradient-to-r 
               group-hover:from-indigo-900 group-hover:via-purple-900 group-hover:to-pink-900 transition-all duration-500"
            ></span>
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 font-semibold">
              Create New NFT
            </span>
          </Link>
        </div>

        <div className="flex mb-8 items-center gap-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 font-medium transition-colors text-sm cursor-pointer duration-200 ease-out ${
              activeTab === "all"
                ? "bg-[#3C3A46] rounded-lg"
                : "hover:bg-[#3C3A46] rounded-lg text-text hover:text-white"
            }`}
          >
            All NFTs ({allNfts.length})
          </button>
          <button
            onClick={() => setActiveTab("my-nfts")}
            className={`px-4 py-2 font-medium transition-colors text-sm cursor-pointer duration-200 ease-out ${
              activeTab === "my-nfts"
                ? "bg-[#3C3A46] rounded-lg"
                : "hover:bg-[#3C3A46] rounded-lg text-text hover:text-white"
            }`}
          >
            My NFTs ({myNfts.length})
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading NFTs...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && displayNfts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="w-24 h-24 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">
              {activeTab === "all"
                ? "No NFTs minted yet"
                : "You don't have any NFTs"}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === "all"
                ? "Be the first to mint an AI Quote NFT!"
                : "Connect your wallet and mint your first NFT"}
            </p>
            {activeTab === "my-nfts" && !isConnected && (
              <p className="text-sm text-gray-500">
                Please connect your wallet to view your NFTs
              </p>
            )}
          </div>
        )}

        {/* NFT Grid */}
        {!loading && displayNfts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayNfts.map((nft) => (
              <div
                key={nft.tokenId}
                className="border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-[#0A0A0C] max-w-sm"
              >
                <div className="relative aspect-video bg-gradient-to-br from-blue-900 to-purple-600 p-2">
                  <img
                    src={nft.imageUrl}
                    alt={nft.metadata.name}
                    className="w-full h-full object-cover rounded-tr-2xl rounded-tl-2xl"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {nft.metadata.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {nft.metadata.description}
                  </p>
                  <div className="flex items-center justify-between text-sm border-t border-t-border pt-3">
                    <span className="text-gray-500">
                      Token ID: {nft.tokenId}
                    </span>
                    <a
                      href={`https://sepolia.etherscan.io/token/${QUOTE_NFT_ADDRESS}?a=${nft.tokenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gradient font-medium hover:opacity-80 transition-opacity"
                    >
                      View on Etherscan →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
