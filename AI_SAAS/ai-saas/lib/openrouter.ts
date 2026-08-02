import OpenAI from "openai";

// Primary: NVIDIA NIM (free tier)
export const nvidiaClient = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || "",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

// Fallback: OpenRouter (free tier models)
export const openrouterClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "Genius AI",
  },
});

export const NVIDIA_CHAT_MODEL =
  process.env.NVIDIA_CHAT_MODEL || "deepseek-ai/deepseek-v4-pro";

export const NVIDIA_CODE_MODEL =
  process.env.NVIDIA_CODE_MODEL || "deepseek-ai/deepseek-v4-pro";

// OpenRouter free-tier fallbacks (verified working via /models + live test)
export const OPENROUTER_CHAT_MODEL =
  process.env.OPENROUTER_CHAT_MODEL || "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free";

export const OPENROUTER_CODE_MODEL =
  process.env.OPENROUTER_CODE_MODEL || "cohere/north-mini-code:free";
