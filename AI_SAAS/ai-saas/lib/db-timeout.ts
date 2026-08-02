import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit } from "@/lib/api-limit";

// Run an async DB-backed check with a hard time limit so a paused/unreachable
// database (e.g. Neon free tier asleep) can never hang the request.
export async function withDbTimeout<T>(fn: () => Promise<T>, fallback: T, ms = 3000): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  try {
    return await Promise.race([fn(), timeout]);
  } catch {
    return fallback;
  } finally {
    clearTimeout(timer!);
  }
}

// Free-tier + subscription checks that fail open quickly when the DB is down.
// Returns [hasFreeTrial, isPro].
export const checkLimits = () =>
  Promise.all([
    withDbTimeout(checkApiLimit, true, 3000),
    withDbTimeout(checkSubscription, false, 3000),
  ]);
