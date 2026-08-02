import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { bumpApiLimit } from "@/lib/api-limit";
import { checkRateLimit } from "@/lib/rate-limit";
import { checkLimits } from "@/lib/db-timeout";

const MAX_PROMPT_LENGTH = 1000;
const MAX_BODY_SIZE = 1024 * 1024; // 1MB
const VALID_RESOLUTIONS = new Set(["256x256", "512x512", "1024x1024", "1792x1024", "1024x1792"]);
const MAX_AMOUNT = 4;
const MIN_AMOUNT = 1;

export async function POST(req: Request) {
  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return new NextResponse("Request body too large", { status: 413 });
    }

    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = "1", resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (typeof prompt !== "string" || prompt.length > MAX_PROMPT_LENGTH) {
      return new NextResponse(`Prompt must be a string under ${MAX_PROMPT_LENGTH} characters`, { status: 400 });
    }

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount < MIN_AMOUNT || parsedAmount > MAX_AMOUNT) {
      return new NextResponse(`Amount must be a number between ${MIN_AMOUNT} and ${MAX_AMOUNT}`, { status: 400 });
    }

    if (!VALID_RESOLUTIONS.has(resolution)) {
      return new NextResponse(`Invalid resolution. Valid options: ${Array.from(VALID_RESOLUTIONS).join(", ")}`, { status: 400 });
    }

    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return new NextResponse("Too many requests. Please try again later.", { status: 429 });
    }

    // DB checks fail open within 3s so a paused DB never delays the call
    const [freeTrial, isPro] = await checkLimits();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const [width, height] = resolution.split("x").map(Number);
    const count = Math.min(parsedAmount, MAX_AMOUNT);
    const seed = Math.floor(Math.random() * 100000);

    // Pollinations.ai — free, no API key
    const results = Array.from({ length: count }, (_, i) => ({
      url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${seed + i}`,
    }));

    if (!isPro) {
      // Fire-and-forget — never delay the response on DB latency
      bumpApiLimit();
    }

    return NextResponse.json(results);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
