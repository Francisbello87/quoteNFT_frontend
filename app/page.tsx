"use client";

import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { useAccount, useWriteContract } from "wagmi";
import { QUOTE_NFT_ABI, QUOTE_NFT_ADDRESS } from "@/lib/contract";
import { Address } from "viem";
import { toast } from "sonner";

export default function Page() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mintingId, setMintingId] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { messages, setMessages, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });


  useEffect(() => {
    const saved = localStorage.getItem("ai-quotes-chat");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (err) {
        console.error("Error loading saved chat:", err);
      }
    }
  }, [setMessages]);


  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ai-quotes-chat", JSON.stringify(messages));
    }
  }, [messages]);


  useEffect(() => {
    const hasAIMessage = messages.some((m) => m.role === "assistant");
    if (hasAIMessage) setIsLoading(false);
  }, [messages]);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);
    sendMessage({
      text: input,
      metadata: { walletAddress: address || "guest" },
    });
    setInput("");
  };

  const handleMint = async (quoteId: string, quoteText: string) => {
    if (!address) return toast.error("Please connect your wallet first.");
    setMintingId(quoteId); 
    const mintToast = toast.loading("Minting your quote NFT...");

    try {
      const imageRes = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote: quoteText }),
      });

      if (!imageRes.ok) throw new Error(await imageRes.text());
      const { imageUri } = await imageRes.json();
      if (!imageUri) throw new Error("No image URI returned");

      const metadata = {
        name: "AI Quote NFT",
        description: quoteText,
        image: imageUri,
      };

      const metadataRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
      });

      if (!metadataRes.ok) throw new Error(await metadataRes.text());
      const { ipfsUri: metadataUri } = await metadataRes.json();

      await writeContractAsync({
        address: QUOTE_NFT_ADDRESS as Address,
        abi: QUOTE_NFT_ABI,
        functionName: "mintQuote",
        args: [address as Address, metadataUri],
        gas: BigInt(250000),
      });

      toast.success("✅ Quote minted successfully!", { id: mintToast });
    } catch (err) {
      console.error("Minting error:", err);
      toast.error(
        err instanceof Error ? `❌ ${err.message}` : "❌ Mint failed",
        {
          id: mintToast,
        }
      );
    } finally {
      setMintingId(null);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between min-h-screen w-full p-6">
      <h1 className="text-2xl font-bold mb-4">AI Quote Generator</h1>

      <div className="flex-1 w-full max-w-2xl overflow-y-auto space-y-3 mb-24">
        {messages.map((m: UIMessage) => {
          const textParts = m.parts.filter((p) => p.type === "text") as {
            type: "text";
            text: string;
          }[];
          const fullText = textParts.map((p) => p.text).join(" ");
          const isAI = m.role === "assistant";

          return (
            <div
              key={m.id}
              className={`flex w-full ${
                isAI ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                  isAI
                    ? "bg-gray-100/85 text-gray-900 rounded-tl-none"
                    : "bg-white/65 text-gray-800 rounded-tr-none"
                }`}
              >
                <p className="text-sm leading-relaxed">{fullText}</p>

                {isAI && isConnected && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleMint(m.id, fullText)}
                      disabled={mintingId === m.id}
                      className={`px-3 py-1 text-xs font-semibold cursor-pointer text-white rounded-lg
                      transition-all duration-200 ease-in-out 
                      bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500
                      hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600
                      active:scale-95 
                      shadow-md hover:shadow-lg
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {mintingId === m.id ? "Minting..." : "Mint as NFT"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl px-4 py-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 flex justify-center"
      >
        <div className="w-full max-w-2xl flex gap-2">
          <input
            className="flex-1 p-2 border border-border rounded-lg"
            placeholder="Enter a theme e.g. courage"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
          />
          <button
            type="submit"
            className={`px-3 py-1 text-xs font-semibold text-white rounded-lg
              transition-all duration-200 ease-in-out 
              bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500
              hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600
              active:scale-95 
              shadow-md hover:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Generate
          </button>
        </div>
      </form>
    </main>
  );
}
