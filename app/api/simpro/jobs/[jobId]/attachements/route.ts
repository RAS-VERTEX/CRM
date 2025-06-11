import { NextRequest, NextResponse } from "next/server";
import { SimproClient } from "@/lib/simpro/client";
import { logger } from "@/lib/utils/logger";
import { validateJobId, validateCompanyId } from "@/lib/utils/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = parseInt(searchParams.get("companyId") || "0");
    const jobId = parseInt(params.jobId);

    // Basic validation
    if (isNaN(jobId) || jobId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid job ID",
        },
        { status: 400 }
      );
    }

    if (isNaN(companyId) || companyId < 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid company ID",
        },
        { status: 400 }
      );
    }

    // Check if environment variables are set
    if (
      !process.env.SIMPRO_BASE_URL ||
      !process.env.SIMPRO_CLIENT_ID ||
      !process.env.SIMPRO_CLIENT_SECRET
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "SimPRO configuration missing. Please check environment variables.",
          code: "CONFIGURATION_MISSING",
        },
        { status: 500 }
      );
    }

    const simpro = new SimproClient({
      baseUrl: process.env.SIMPRO_BASE_URL,
      clientId: process.env.SIMPRO_CLIENT_ID,
      clientSecret: process.env.SIMPRO_CLIENT_SECRET,
    });

    const attachments = await simpro.getJobAttachments(companyId, jobId, {
      pageSize: 250,
    });

    const imageAttachments = attachments.filter((att) =>
      att.MimeType?.startsWith("image/")
    );

    const attachmentsWithBase64 = await Promise.all(
      imageAttachments.map(async (attachment) => {
        try {
          const fullAttachment = await simpro.getJobAttachmentWithBase64(
            companyId,
            jobId,
            attachment.ID
          );
          return fullAttachment;
        } catch (error) {
          logger.error(
            `Failed to get Base64 for attachment ${attachment.ID}`,
            error
          );
          return attachment;
        }
      })
    );

    let jobDetails = null;
    try {
      const jobs = await simpro.getJobsForDate(
        new Date().toISOString().split("T")[0]
      );
      jobDetails = jobs.find((job) => job.ID === jobId);
    } catch (error) {
      logger.warn(`Could not fetch job details for job ${jobId}`, error);
    }

    logger.info(
      `Retrieved ${attachmentsWithBase64.length} image attachments for job ${jobId}`
    );

    return NextResponse.json({
      success: true,
      attachments: attachmentsWithBase64,
      job: jobDetails,
      metadata: {
        totalAttachments: attachments.length,
        imageAttachments: attachmentsWithBase64.length,
        jobId,
        companyId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error(`Failed to fetch attachments for job ${params.jobId}`, error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const statusCode = errorMessage.includes("Authentication")
      ? 401
      : errorMessage.includes("not found")
      ? 404
      : 500;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        code:
          statusCode === 401
            ? "AUTHENTICATION_FAILED"
            : statusCode === 404
            ? "JOB_NOT_FOUND"
            : "INTERNAL_ERROR",
      },
      { status: statusCode }
    );
  }
}
