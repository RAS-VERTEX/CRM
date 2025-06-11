import { NextResponse } from "next/server";
import { fetchSalespeople } from "../../../lib/simpro-api";

export async function GET() {
  try {
    console.log("Fetching salespeople...");
    const salespeople = await fetchSalespeople();
    console.log(`Found ${salespeople.length} salespeople`);
    return NextResponse.json(salespeople);
  } catch (error) {
    console.error("API Error fetching salespeople:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to fetch salespeople",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
