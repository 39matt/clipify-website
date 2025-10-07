import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    // Validate input
    if (
      !url ||
      !/^https:\/\/vm\.tiktok\.com\/[A-Za-z0-9]+\/?$/.test(url)
    ) {
      return NextResponse.json(
        { error: "Invalid TikTok mobile URL" },
        { status: 400 }
      );
    }

    // Follow redirect server-side (no CORS issues here)
    const response = await fetch(url, { redirect: "follow" });
    const finalUrl = response.url;

    return NextResponse.json({ finalUrl });
  } catch (error) {
    console.error("Error resolving TikTok URL:", error);
    return NextResponse.json(
      { error: "Failed to resolve TikTok URL" },
      { status: 500 }
    );
  }
}