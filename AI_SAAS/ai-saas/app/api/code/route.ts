import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { bumpApiLimit } from "@/lib/api-limit";
import { checkRateLimit } from "@/lib/rate-limit";
import { checkLimits } from "@/lib/db-timeout";
import { NVIDIA_CODE_MODEL, OPENROUTER_CODE_MODEL } from "@/lib/openrouter";
import { createStreamWithFallback, streamToResponse } from "@/lib/ai-fallback";

const MAX_PROMPT_LENGTH = 1000;
const MAX_BODY_SIZE = 1024 * 1024; // 1MB
const NVIDIA_STREAM_TIMEOUT_MS = 25000; // wait this long on NVIDIA before falling back
const STREAM_TIMEOUT_MS = 120000; // overall stream cap

export async function POST(req: Request) {
  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return new NextResponse("Request body too large", { status: 413 });
    }

    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.NVIDIA_API_KEY && !process.env.OPENROUTER_API_KEY) {
      return new NextResponse("No AI provider configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    if (!Array.isArray(messages)) {
      return new NextResponse("Messages must be an array", { status: 400 });
    }

    for (const msg of messages) {
      if (typeof msg.content !== "string" || msg.content.length > MAX_PROMPT_LENGTH) {
        return new NextResponse(`Each message must be a string under ${MAX_PROMPT_LENGTH} characters`, { status: 400 });
      }
    }

    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return new NextResponse("Too many requests. Please try again later.", { status: 429 });
    }

    // DB checks fail open within 3s so a paused DB never delays the AI call
    const [freeTrial, isPro] = await checkLimits();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const { stream } = await createStreamWithFallback(
      {
        model: NVIDIA_CODE_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
          },
          ...messages,
        ],
        temperature: 1,
        top_p: 0.95,
        max_tokens: 4096,
        ...({ chat_template_kwargs: { thinking: false } } as any),
      },
      OPENROUTER_CODE_MODEL,
      NVIDIA_STREAM_TIMEOUT_MS
    );

    const readable = streamToResponse(stream, STREAM_TIMEOUT_MS);

    if (!isPro) {
      // Fire-and-forget — never delay the AI response on DB latency
      bumpApiLimit();
    }

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: any) {
    console.log("[CODE_ERROR]", error);
    const isAbort =
      error?.name === "AbortError" ||
      error?.name === "APIUserAbortError" ||
      error?.message?.includes("timed out") ||
      error?.message?.includes("aborted");
    if (isAbort) {
      return new NextResponse("AI provider timed out. Please try again.", { status: 504 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
