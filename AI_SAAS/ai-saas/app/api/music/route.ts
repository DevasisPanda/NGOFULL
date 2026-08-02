import Replicate from "replicate";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { bumpApiLimit } from "@/lib/api-limit";
import { checkRateLimit } from "@/lib/rate-limit";
import { checkLimits, withDbTimeout } from "@/lib/db-timeout";

const MAX_PROMPT_LENGTH = 1000;
const MAX_BODY_SIZE = 1024 * 1024; // 1MB
const AI_TIMEOUT_MS = 60000; // 60 seconds for music generation

export async function POST(req: Request) {
  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return new NextResponse("Request body too large", { status: 413 });
    }

    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (typeof prompt !== "string" || prompt.length > MAX_PROMPT_LENGTH) {
      return new NextResponse(`Prompt must be a string under ${MAX_PROMPT_LENGTH} characters`, { status: 400 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return new NextResponse("Replicate API token not configured. Music generation requires Replicate.", { status: 500 });
    }

    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return new NextResponse("Too many requests. Please try again later.", { status: 429 });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // DB checks fail open within 3s so a paused DB never delays the call
    const [freeTrial, isPro] = await checkLimits();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const response = await withDbTimeout(
      () =>
        replicate.run(
          "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
          {
            input: {
              prompt_a: prompt,
            },
          }
        ),
      null,
      AI_TIMEOUT_MS
    );

    if (!isPro) {
      // Fire-and-forget — never delay the response on DB latency
      bumpApiLimit();
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.log("[MUSIC_ERROR]", error);
    if (error?.message?.includes("timed out")) {
      return new NextResponse("AI provider timed out. Please try again.", { status: 504 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
