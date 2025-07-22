// app/api/pdf/job-report/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ChromePDFGenerator } from "@/lib/pdf/chrome-pdf-generator";

export async function POST(request: NextRequest) {
  const generator = new ChromePDFGenerator();

  try {
    const reportData = await request.json();

    // Validate required data
    if (!reportData.job || !reportData.projectDetails) {
      return NextResponse.json(
        { error: "Missing required job or project details" },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdfBuffer = await generator.generateJobReportPDF(reportData, {
      format: "A4",
      printBackground: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${
          reportData.projectDetails.projectName || "job-report"
        }.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  } finally {
    await generator.close();
  }
}
