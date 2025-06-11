import { NextRequest, NextResponse } from "next/server";
import { fetchQuotesWithCoordinates } from "../../../../lib/simpro-api";

interface RouteContext {
  params: {
    salespersonId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { salespersonId } = params;

  console.log(`Fetching quotes for salesperson ID: ${salespersonId}`);

  // Validate salesperson ID
  const parsedId = parseInt(salespersonId, 10);
  if (isNaN(parsedId)) {
    console.error(`Invalid salesperson ID: ${salespersonId}`);
    return NextResponse.json(
      { error: "Salesperson ID must be a valid number" },
      { status: 400 }
    );
  }

  try {
    const quotes = await fetchQuotesWithCoordinates(parsedId);
    console.log(`Found ${quotes.length} quotes for salesperson ${parsedId}`);

    // Log first quote for debugging
    if (quotes.length > 0) {
      console.log("Sample quote:", {
        ID: quotes[0].ID,
        Name: quotes[0].Name,
        Status: quotes[0].Status,
        Stage: quotes[0].Stage,
        Salesperson: quotes[0].Salesperson,
        Site: quotes[0].Site?.Name,
      });
    }

    return NextResponse.json(quotes);
  } catch (error) {
    console.error(
      `API Error fetching quotes for salesperson ${parsedId}:`,
      error
    );
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to fetch quotes",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
