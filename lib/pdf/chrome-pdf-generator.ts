"use client";
// lib/pdf/chrome-pdf-generator.ts
import puppeteer from "puppeteer";
import { SimproJob, SimproAttachment } from "@/lib/types";

interface PDFGenerationOptions {
  format?: "A4" | "Letter";
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  printBackground?: boolean;
  scale?: number;
}

interface JobReportData {
  job: SimproJob;
  attachments: SimproAttachment[];
  projectDetails: {
    projectName: string;
    preparedFor: string;
    preparedBy: string;
    address: string;
    date: string;
    qbcc?: string;
    abn?: string;
    website?: string;
  };
}

export class ChromePDFGenerator {
  private browser: puppeteer.Browser | null = null;

  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu",
        ],
      });
    }
  }

  async generateJobReportPDF(
    reportData: JobReportData,
    options: PDFGenerationOptions = {}
  ): Promise<Buffer> {
    await this.initialize();

    if (!this.browser) {
      throw new Error("Failed to initialize browser");
    }

    const page = await this.browser.newPage();

    try {
      // Set viewport for consistent rendering
      await page.setViewport({ width: 1200, height: 1600 });

      // Generate the HTML content
      const htmlContent = this.generateJobReportHTML(reportData);

      // Set content and wait for images to load
      await page.setContent(htmlContent, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: options.format || "A4",
        margin: options.margin || {
          top: "10mm",
          right: "10mm",
          bottom: "10mm",
          left: "10mm",
        },
        printBackground: options.printBackground ?? true,
        scale: options.scale || 1,
        preferCSSPageSize: true,
      });

      return pdfBuffer;
    } finally {
      await page.close();
    }
  }

  private generateJobReportHTML(data: JobReportData): string {
    const { job, attachments, projectDetails } = data;

    // Filter image attachments
    const imageAttachments = attachments.filter((att) =>
      att.MimeType?.startsWith("image/")
    );

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectDetails.projectName} - Report</title>
  <style>
    ${this.getReportCSS()}
  </style>
</head>
<body>
  ${this.generateCoverPage(data)}
  ${this.generatePhotoPages(imageAttachments)}
</body>
</html>`;
  }

  private generateCoverPage(data: JobReportData): string {
    const { job, projectDetails } = data;

    return `
<div class="cover-page">
  <!-- Header with company branding -->
  <div class="header">
    <div class="company-logo">
      <div class="logo-container">
        <div class="logo-ras">RAS</div>
        <div class="logo-vertex">VERTEX</div>
      </div>
      <div class="company-tagline">
        <div class="maintenance-text">MAINTENANCE SOLUTIONS</div>
        <div class="location-text">SUNSHINE COAST</div>
      </div>
    </div>
    <div class="website">
      <span class="search-icon">🔍</span>
      ${projectDetails.website || "rasvertex.com.au"}
    </div>
  </div>

  <!-- Background image area -->
  <div class="hero-section">
    <div class="building-silhouette"></div>
  </div>

  <!-- Project details overlay -->
  <div class="project-overlay">
    <div class="date">${projectDetails.date}</div>
    <h1 class="project-title">${projectDetails.projectName}</h1>
    <p class="project-description">
      This quotation outlines a comprehensive roof refurbishment,
      state-of-the-art waterproofing, and a full-building repaint.
    </p>
    
    <div class="details-section">
      <div class="detail-item">
        <span class="label">PREPARED FOR:</span>
        <span class="value">${projectDetails.preparedFor}</span>
      </div>
      <div class="detail-item">
        <span class="label">PREPARED BY:</span>
        <span class="value">${projectDetails.preparedBy}</span>
      </div>
      <div class="detail-item">
        <span class="label">ADDRESS:</span>
        <span class="value">${projectDetails.address}</span>
      </div>
      <div class="detail-item">
        <span class="label">DETAILS:</span>
        <span class="value">${job.Description || "Project Details"}</span>
      </div>
    </div>

    <!-- Partner logos -->
    <div class="partner-logos">
      <div class="haymes-logo">Haymes PAINT</div>
      <div class="mpa-logo">
        <div class="mpa-text">MPA</div>
        <div class="master-text">MASTER<br>PAINTERS<br>AUSTRALIA</div>
      </div>
    </div>
  </div>

  <!-- Footer credentials -->
  <div class="credentials">
    <div class="qbcc">QBCC: ${projectDetails.qbcc || "1307234"}</div>
    <div class="abn">ABN: ${projectDetails.abn || "53 167 652 637"}</div>
  </div>
</div>`;
  }

  private generatePhotoPages(attachments: SimproAttachment[]): string {
    if (!attachments.length) return "";

    const photosPerPage = 6;
    const pages: string[] = [];

    for (let i = 0; i < attachments.length; i += photosPerPage) {
      const pagePhotos = attachments.slice(i, i + photosPerPage);

      pages.push(`
<div class="photo-page">
  <div class="photo-grid">
    ${pagePhotos
      .map(
        (photo) => `
      <div class="photo-item">
        <div class="photo-container">
          <img src="data:${photo.MimeType};base64,${photo.Base64Data}" 
               alt="${photo.Filename}" 
               loading="lazy" />
        </div>
        <div class="photo-caption">
          ${photo.Filename.replace(/\.[^/.]+$/, "")}
        </div>
      </div>
    `
      )
      .join("")}
  </div>
</div>`);
    }

    return pages.join("");
  }

  private getReportCSS(): string {
    return `
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.4;
  color: #333;
  background: white;
}

/* Cover page styles */
.cover-page {
  width: 210mm;
  height: 297mm;
  position: relative;
  page-break-after: always;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1e3a8a 100%);
  overflow: hidden;
}

/* Header styling */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20mm 15mm 0;
  position: relative;
  z-index: 10;
}

.company-logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-container {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.logo-ras {
  background: #ef4444;
  color: white;
  padding: 8px 12px;
  font-weight: bold;
  font-size: 24px;
  border-radius: 4px;
}

.logo-vertex {
  background: white;
  color: #1e40af;
  padding: 8px 12px;
  font-weight: bold;
  font-size: 24px;
  border-radius: 4px;
}

.company-tagline {
  color: white;
  font-size: 12px;
  line-height: 1.2;
}

.maintenance-text {
  font-weight: bold;
}

.location-text {
  font-weight: normal;
}

.website {
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-icon {
  background: white;
  color: #1e40af;
  padding: 4px 6px;
  border-radius: 50%;
  font-size: 12px;
}

/* Hero section with building silhouette */
.hero-section {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect fill="%23ffffff20" width="100" height="300" x="50" y="250"/><rect fill="%23ffffff15" width="80" height="280" x="160" y="270"/><rect fill="%23ffffff25" width="120" height="320" x="250" y="230"/><rect fill="%23ffffff20" width="90" height="290" x="380" y="260"/><rect fill="%23ffffff30" width="110" height="340" x="480" y="210"/><rect fill="%23ffffff15" width="85" height="275" x="600" y="275"/></svg>') no-repeat center bottom;
  background-size: cover;
  opacity: 0.8;
}

/* Project details overlay */
.project-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent 0%, rgba(255,255,255,0.95) 30%, white 100%);
  padding: 40mm 15mm 25mm;
}

.date {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.project-title {
  font-size: 48px;
  font-weight: bold;
  color: #1e40af;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.project-description {
  font-size: 16px;
  color: #555;
  margin-bottom: 30px;
  max-width: 600px;
  line-height: 1.6;
}

.details-section {
  display: grid;
  gap: 8px;
  margin-bottom: 25px;
}

.detail-item {
  display: flex;
  gap: 15px;
}

.detail-item .label {
  font-weight: bold;
  color: #1e40af;
  min-width: 120px;
  font-size: 14px;
}

.detail-item .value {
  color: #333;
  font-size: 14px;
}

/* Partner logos */
.partner-logos {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-top: 20px;
}

.haymes-logo {
  background: #1e40af;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
}

.mpa-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e40af;
  font-weight: bold;
}

.mpa-text {
  font-size: 24px;
  background: #1e40af;
  color: white;
  padding: 4px 8px;
  border-radius: 50%;
}

.master-text {
  font-size: 10px;
  line-height: 1.1;
  text-align: left;
}

/* Credentials */
.credentials {
  position: absolute;
  bottom: 20mm;
  right: 15mm;
  text-align: right;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.qbcc {
  margin-bottom: 4px;
}

/* Photo pages */
.photo-page {
  width: 210mm;
  height: 297mm;
  padding: 15mm;
  page-break-after: always;
  page-break-inside: avoid;
}

.photo-page:last-child {
  page-break-after: auto;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10mm;
  height: 100%;
}

.photo-item {
  display: flex;
  flex-direction: column;
  page-break-inside: avoid;
  break-inside: avoid;
}

.photo-container {
  flex: 1;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120mm;
}

.photo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.photo-caption {
  background: #f8f9fa;
  padding: 8px 12px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  border-radius: 0 0 8px 8px;
  margin-top: 2px;
}

/* Print optimizations */
@media print {
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  .cover-page,
  .photo-page {
    page-break-inside: avoid;
  }
  
  .photo-item {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}

/* Page breaks */
@page {
  margin: 0;
  size: A4;
}`;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// API Route: app/api/pdf/job-report/route.ts
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

// React Hook for PDF Generation: lib/hooks/use-pdf-generator.ts
import { useState } from "react";
import { SimproJob } from "@/lib/types";

interface PDFGenerationOptions {
  projectName: string;
  preparedFor: string;
  preparedBy: string;
  address: string;
  qbcc?: string;
  abn?: string;
  website?: string;
}

export const usePDFGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateJobReport = async (
    job: SimproJob,
    attachments: any[],
    options: PDFGenerationOptions
  ) => {
    setLoading(true);
    setError(null);

    try {
      const reportData = {
        job,
        attachments,
        projectDetails: {
          ...options,
          date: new Date().toLocaleDateString("en-AU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        },
      };

      const response = await fetch("/api/pdf/job-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${options.projectName || "job-report"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return {
    generateJobReport,
    loading,
    error,
  };
};

// Package.json dependencies to add:
/*
{
  "dependencies": {
    "puppeteer": "^21.0.0"
  },
  "devDependencies": {
    "@types/puppeteer": "^7.0.0"
  }
}
*/
