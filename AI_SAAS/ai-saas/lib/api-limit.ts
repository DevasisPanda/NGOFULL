import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const incrementApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  try {
    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: { userId: userId },
    });

    if (userApiLimit) {
      await prismadb.userApiLimit.update({
        where: { userId: userId },
        data: { count: userApiLimit.count + 1 },
      });
    } else {
      await prismadb.userApiLimit.create({
        data: { userId: userId, count: 1 },
      });
    }
  } catch (error) {
    console.error("[API_LIMIT_INCREMENT_ERROR]", error);
  }
};

// Fire-and-forget counter bump — never delays the AI response on DB latency.
export const bumpApiLimit = () => {
  incrementApiLimit().catch(() => {});
};

export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  try {
    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: { userId: userId },
    });

    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("[API_LIMIT_CHECK_ERROR]", error);
    // Fail open if DB is unreachable so the app doesn't block users
    return true;
  }
};

export const getApiLimitCount = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  try {
    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: {
        userId
      }
    });

    if (!userApiLimit) {
      return 0;
    }

    return userApiLimit.count;
  } catch (error) {
    console.error("[API_LIMIT_COUNT_ERROR]", error);
    return 0;
  }
};
