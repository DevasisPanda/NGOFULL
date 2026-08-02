import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { withDbTimeout } from "@/lib/db-timeout";

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const generations = await withDbTimeout(
      () =>
        prismadb.generation.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
      [],
      5000
    );

    return NextResponse.json(generations);
  } catch (error) {
    console.log("[HISTORY_GET_ERROR]", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { toolType, prompt, response } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!toolType || !prompt) {
      return new NextResponse("Tool type and prompt are required", { status: 400 });
    }

    await withDbTimeout(
      () =>
        prismadb.generation.create({
          data: {
            userId,
            toolType,
            prompt,
            response: response || null,
          },
        }),
      null,
      5000
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.log("[HISTORY_POST_ERROR]", error);
    // Never fail the caller — history is best-effort
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
