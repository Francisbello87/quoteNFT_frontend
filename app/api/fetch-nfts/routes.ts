import { NextRequest, NextResponse } from "next/server";
import { AlchemyNFTResponse, AlchemyNFT, ProcessedNFT } from "@/lib/types";


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

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const address = searchParams.get("address");
    const type = searchParams.get("type");
    const contractAddress = process.env.NEXT_PUBLIC_QUOTE_NFT_CONTRACT_ADDRESS;

    const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC;
    if (!alchemyUrl) {
      return NextResponse.json(
        { error: "Alchemy RPC not configured" },
        { status: 500 }
      );
    }

    let nfts: ProcessedNFT[] = [];

    if (type === "all") {
      const response = await fetch(
        `${alchemyUrl}/getNFTsForContract?contractAddress=${contractAddress}&withMetadata=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch NFTs from Alchemy");
      }

      const data = await response.json();
      nfts = data.nfts?.map((nft: AlchemyNFT) => processNFT(nft)) || [];
    } else if (type === "owner" && address) {
      const response = await fetch(
        `${alchemyUrl}/getNFTsForOwner?owner=${address}&contractAddresses[]=${contractAddress}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch NFTs from Alchemy");
      }

      const data: AlchemyNFTResponse = await response.json();
      nfts =
        data.ownedNfts?.map((nft: AlchemyNFT) => processNFT(nft, address)) ||
        [];
    } else {
      return NextResponse.json(
        {
          error: "Invalid request. Provide type=all or type=owner with address",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      nfts,
      total: nfts.length,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return NextResponse.json(
      { error: "Failed to fetch NFTs", success: false },
      { status: 500 }
    );
  }
}
