import { NextRequest, NextResponse } from "next/server";
import { SimproClient } from "@/lib/simpro-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date =
    searchParams.get("date") || new Date().toISOString().split("T")[0];

  try {
    const simpro = new SimproClient({
      baseUrl: process.env.SIMPRO_BASE_URL!,
      clientId: process.env.SIMPRO_CLIENT_ID!,
      clientSecret: process.env.SIMPRO_CLIENT_SECRET!,
    });

    const jobs = await simpro.getJobsForDate(date);
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
