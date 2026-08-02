import {
  nvidiaClient,
  openrouterClient,
  OPENROUTER_CHAT_MODEL,
} from "@/lib/openrouter";

// How long to wait on the primary (NVIDIA) before falling back.
// NVIDIA's free tier can hang or 529 when overloaded.
const PRIMARY_TIMEOUT_MS = 20000;

export function isProviderOverload(error: any): boolean {
  const status = error?.status;
  const code = error?.code;
  const type = error?.type;
  const msg = String(error?.message || "");
  return (
    status === 429 ||
    status === 529 ||
    code === 529 ||
    type === "Overloaded" ||
    msg.includes("overloaded") ||
    msg.includes("rate limit") ||
    msg.includes("quota")
  );
}

export function isTimeoutError(error: any): boolean {
  const name = error?.name;
  const msg = String(error?.message || "");
  return (
    name === "AbortError" ||
    name === "APIUserAbortError" ||
    name === "TimeoutError" ||
    msg.includes("timed out") ||
    msg.includes("aborted") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("ECONNRESET")
  );
}

export function shouldFallback(error: any): boolean {
  return isProviderOverload(error) || isTimeoutError(error);
}

export function raceWithTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Provider timed out")), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); }
    );
  });
}

/**
 * Create an OpenAI chat stream with NVIDIA as primary and OpenRouter as
 * fallback. Returns the stream and which provider answered.
 */
export async function createStreamWithFallback(
  body: Record<string, any>,
  fallbackModel: string = OPENROUTER_CHAT_MODEL,
  primaryTimeoutMs: number = PRIMARY_TIMEOUT_MS
): Promise<{ stream: any; provider: "nvidia" | "openrouter" }> {
  if (process.env.NVIDIA_API_KEY) {
    try {
      const stream = await raceWithTimeout(
        nvidiaClient.chat.completions.create({ ...body, stream: true } as any),
        primaryTimeoutMs
      );
      return { stream, provider: "nvidia" };
    } catch (err: any) {
      if (shouldFallback(err) && process.env.OPENROUTER_API_KEY) {
        console.log(`[AI] NVIDIA failed (${err?.message || err?.name}) → OpenRouter`);
        const stream = await openrouterClient.chat.completions.create({
          ...body,
          model: fallbackModel,
          stream: true,
        } as any);
        return { stream, provider: "openrouter" };
      }
      throw err;
    }
  }
  const stream = await openrouterClient.chat.completions.create({
    ...body,
    model: fallbackModel,
    stream: true,
  } as any);
  return { stream, provider: "openrouter" };
}

/** Turn an async-iterable AI stream into a plain-text streaming Response. */
export function streamToResponse(
  stream: any,
  timeoutMs: number
): ReadableStream {
  const encoder = new TextEncoder();
  const streamController = new AbortController();
  const streamTimeout = setTimeout(() => streamController.abort(), timeoutMs);

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream as any) {
          const content = chunk?.choices?.[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
        clearTimeout(streamTimeout);
      } catch (err) {
        clearTimeout(streamTimeout);
        controller.error(err);
      }
    },
    cancel() {
      clearTimeout(streamTimeout);
      streamController.abort();
    },
  });
}
