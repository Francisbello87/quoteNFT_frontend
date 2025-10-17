export interface TokenMetadata {
  tokenType: string;
}

export interface TokenId {
  tokenId: string;
  tokenMetadata: TokenMetadata;
}

export interface ContractInfo {
  address: string;
}

export interface TokenUri {
  gateway: string;
  raw: string;
}

export interface Media {
  gateway: string;
  raw: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
}

export interface ContractMetadata {
  name: string;
  symbol: string;
  tokenType: string;
  contractDeployer: string;
  deployedBlockNumber: number;
  openSea: Record<string, unknown>;
}

export interface SpamInfo {
  isSpam: string;
  classifications: string[];
}

export interface AlchemyNFT {
  contract: ContractInfo;
  id: TokenId;
  balance: string;
  title: string;
  description: string;
  tokenUri: TokenUri;
  media: Media[];
  metadata: NFTMetadata;
  timeLastUpdated: string;
  contractMetadata: ContractMetadata;
  spamInfo: SpamInfo;
}

export interface AlchemyNFTResponse {
  ownedNfts: AlchemyNFT[];
  totalCount: number;
  blockHash: string;
}

export interface ProcessedNFT {
  tokenId: number;
  tokenURI: string;
  metadata: NFTMetadata;
  imageUrl: string;
  owner?: string;
  mintedAt: string;
}
