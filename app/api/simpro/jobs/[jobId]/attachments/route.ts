// app/api/simpro/jobs/[jobId]/attachments/route.ts
import { NextRequest, NextResponse } from "next/server";

const SIMPRO_BASE_URL = process.env.NEXT_PUBLIC_SIMPRO_BASE_URL;
const SIMPRO_ACCESS_TOKEN = process.env.SIMPRO_ACCESS_TOKEN;

interface RouteContext {
  params: {
    jobId: string;
  };
}

// Types based on SimPRO API documentation
interface SimproAttachmentList {
  ID: string;
  Filename: string;
}

interface SimproAttachmentDetail {
  ID: string;
  Filename: string;
  Folder?: {
    ID: number;
    Name: string;
  } | null;
  Public?: boolean;
  Email?: boolean;
  MimeType?: string;
  FileSizeBytes?: number;
  DateAdded?: string;
  AddedBy?: {
    ID: number;
    Name: string;
    Type: string;
    TypeId: number;
  } | null;
  Base64Data?: string; // Only present when using ?display=Base64
}

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  console.log(`Making API request to: ${url}`);

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${SIMPRO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  console.log(`Response status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error Response: ${errorText}`);
    throw new Error(
      `HTTP error! status: ${response.status} - ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log(
    `Received ${Array.isArray(data) ? data.length : "non-array"} items`
  );
  return data;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { jobId } = params;
  const { searchParams } = new URL(request.url);
  const companyId = parseInt(searchParams.get("companyId") || "0");

  console.log(`=== SIMPRO ATTACHMENTS REQUEST ===`);
  console.log(`Job ID from params: ${jobId} (type: ${typeof jobId})`);
  console.log(`Company ID: ${companyId}`);
  console.log(`Full URL: ${request.url}`);

  // Validate environment variables
  if (!SIMPRO_BASE_URL || !SIMPRO_ACCESS_TOKEN) {
    console.error("Missing required environment variables");
    console.error("SIMPRO_BASE_URL:", SIMPRO_BASE_URL ? "✓ Set" : "✗ Missing");
    console.error(
      "SIMPRO_ACCESS_TOKEN:",
      SIMPRO_ACCESS_TOKEN ? "✓ Set" : "✗ Missing"
    );
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

  // Validate job ID - check for undefined, null, or empty string
  if (!jobId || jobId === "undefined" || jobId.trim() === "") {
    console.error(
      `Invalid job ID received: "${jobId}" (type: ${typeof jobId})`
    );
    return NextResponse.json(
      {
        success: false,
        error: `Invalid job ID: "${jobId}". Please provide a valid job number.`,
        code: "INVALID_JOB_ID",
      },
      { status: 400 }
    );
  }

  const parsedJobId = parseInt(jobId, 10);
  if (isNaN(parsedJobId) || parsedJobId <= 0) {
    console.error(`Job ID is not a valid number: ${jobId}`);
    return NextResponse.json(
      {
        success: false,
        error: `Job ID must be a valid positive number, got: "${jobId}"`,
        code: "INVALID_JOB_ID",
      },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching attachments for job ${parsedJobId}...`);

    // Step 1: List all attachments for the job
    // API: GET /api/v1.0/companies/{companyID}/jobs/{jobID}/attachments/files/
    const listAttachmentsUrl = `${SIMPRO_BASE_URL}/api/v1.0/companies/${companyId}/jobs/${parsedJobId}/attachments/files/?pageSize=250`;

    console.log(`Fetching attachment list from: ${listAttachmentsUrl}`);
    const attachmentsList = await apiRequest<SimproAttachmentList[]>(
      listAttachmentsUrl
    );

    console.log(`Found ${attachmentsList.length} total attachments`);

    if (attachmentsList.length === 0) {
      return NextResponse.json({
        success: true,
        attachments: [],
        job: null,
        metadata: {
          totalAttachments: 0,
          imageAttachments: 0,
          jobId: parsedJobId,
          companyId,
          timestamp: new Date().toISOString(),
          message: `No attachments found for job ${parsedJobId}`,
        },
      });
    }

    // Step 2: Get detailed info for each attachment with Base64 data
    console.log(
      `Getting detailed info for ${attachmentsList.length} attachments...`
    );

    const attachmentDetails = await Promise.all(
      attachmentsList.map(async (attachment, index) => {
        try {
          console.log(
            `Getting details for attachment ${index + 1}/${
              attachmentsList.length
            }: ${attachment.ID} (${attachment.Filename})`
          );

          // API: GET /api/v1.0/companies/{companyID}/jobs/{jobID}/attachments/files/{fileID}?display=Base64
          const detailUrl = `${SIMPRO_BASE_URL}/api/v1.0/companies/${companyId}/jobs/${parsedJobId}/attachments/files/${attachment.ID}?display=Base64`;

          const detail = await apiRequest<SimproAttachmentDetail>(detailUrl);

          console.log(
            `✓ Got details for ${attachment.Filename} - MimeType: ${
              detail.MimeType
            }, HasBase64: ${!!detail.Base64Data}`
          );

          return detail;
        } catch (error) {
          console.error(
            `Failed to get details for attachment ${attachment.ID} (${attachment.Filename}):`,
            error
          );
          // Return basic info if detailed fetch fails
          return {
            ID: attachment.ID,
            Filename: attachment.Filename,
            MimeType: "unknown",
            FileSizeBytes: 0,
          } as SimproAttachmentDetail;
        }
      })
    );

    // Step 3: Filter for images only
    const imageAttachments = attachmentDetails.filter((att) => {
      const isImage = att.MimeType?.startsWith("image/");
      console.log(
        `${att.Filename}: MimeType=${att.MimeType}, IsImage=${isImage}`
      );
      return isImage;
    });

    console.log(
      `Found ${imageAttachments.length} image attachments out of ${attachmentDetails.length} total`
    );

    if (imageAttachments.length === 0) {
      return NextResponse.json({
        success: true,
        attachments: [],
        job: null,
        metadata: {
          totalAttachments: attachmentsList.length,
          imageAttachments: 0,
          jobId: parsedJobId,
          companyId,
          timestamp: new Date().toISOString(),
          message: `No image attachments found for job ${parsedJobId}. Found ${attachmentsList.length} total attachments but none were images.`,
          allAttachments: attachmentDetails.map((att) => ({
            filename: att.Filename,
            mimeType: att.MimeType,
          })),
        },
      });
    }

    console.log(
      `Successfully processed ${imageAttachments.length} image attachments for job ${parsedJobId}`
    );

    return NextResponse.json({
      success: true,
      attachments: imageAttachments,
      job: null,
      metadata: {
        totalAttachments: attachmentsList.length,
        imageAttachments: imageAttachments.length,
        jobId: parsedJobId,
        companyId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(`ERROR fetching attachments for job ${jobId}:`, error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    const statusCode =
      errorMessage.includes("Authentication") || errorMessage.includes("401")
        ? 401
        : errorMessage.includes("not found") || errorMessage.includes("404")
        ? 404
        : 500;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        jobId: jobId,
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
