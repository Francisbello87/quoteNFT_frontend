import { NextResponse } from "next/server";
import { huggingface } from "@ai-sdk/huggingface";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  type ModelMessage,
} from "ai";

interface ExtendedUIMessage extends UIMessage {
  metadata?: {
    walletAddress?: string;
  };
}



const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 5;

function checkRateLimit(id: string) {
  const now = Date.now();
  const record = rateLimitMap.get(id);

  if (!record) {
    rateLimitMap.set(id, { count: 1, lastReset: now });
    return true;
  }

  if (now - record.lastReset > 60_000) {
    rateLimitMap.set(id, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= LIMIT) return false;

  record.count++;
  return true;
}

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: ExtendedUIMessage[] } = await req.json();

  const ip = req.headers.get("x-forwarded-for") || "anon";
  const user = messages.find((m) => m.role === "user");
  const wallet = user?.metadata?.walletAddress;
  const identifier = wallet || ip;

  console.log(user?.metadata);

  if (!checkRateLimit(identifier)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait a minute." },
      { status: 429 }
    );
  }

  const systemPrompt: ModelMessage = {
    role: "system",
    content:
      "You are a quote generation AI. Reply ONLY with a short, meaningful quote — no intros, explanations, or emojis.",
  };

  try {
    const result = streamText({
      model: huggingface("deepseek-ai/DeepSeek-V3-0324"),
      messages: [systemPrompt, ...convertToModelMessages(messages)],
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("AI error:", err);
    return NextResponse.json(
      { error: "AI service unavailable. Try again later." },
      { status: 500 }
    );
  }
}

