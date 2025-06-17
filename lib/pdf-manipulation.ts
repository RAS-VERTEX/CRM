// lib/pdf-manipulation.ts
import { PDFDocument, PDFPage, degrees } from "pdf-lib";

export interface PDFPageInfo {
  id: string;
  pdfId: string;
  pageNumber: number;
  thumbnail?: string;
  source: "main" | "photos" | "uploaded";
  title?: string;
  pdfDoc?: PDFDocument;
  originalPage?: PDFPage;
}

export interface LoadedPDFInfo {
  id: string;
  name: string;
  file: File;
  pdfDoc: PDFDocument;
  pages: PDFPageInfo[];
  source: "main" | "photos" | "uploaded";
}

/**
 * Load PDF file and extract page information
 */
export async function loadPDFFile(
  file: File,
  source: "main" | "photos" | "uploaded" = "uploaded"
): Promise<LoadedPDFInfo> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pdfId = Math.random().toString(36).substr(2, 9);

  const pageCount = pdfDoc.getPageCount();
  const pages: PDFPageInfo[] = [];

  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);

    // Generate thumbnail (simplified - you might want to use PDF.js for better thumbnails)
    const thumbnail = await generatePageThumbnail(pdfDoc, i);

    pages.push({
      id: `${pdfId}-page-${i}`,
      pdfId,
      pageNumber: i + 1,
      thumbnail,
      source,
      title: `${file.name} - Page ${i + 1}`,
      pdfDoc,
      originalPage: page,
    });
  }

  return {
    id: pdfId,
    name: file.name,
    file,
    pdfDoc,
    pages,
    source,
  };
}

/**
 * Generate thumbnail for a PDF page
 */
async function generatePageThumbnail(
  pdfDoc: PDFDocument,
  pageIndex: number
): Promise<string> {
  try {
    // Create a new PDF with just this page for thumbnail generation
    const thumbnailDoc = await PDFDocument.create();
    const [copiedPage] = await thumbnailDoc.copyPages(pdfDoc, [pageIndex]);
    thumbnailDoc.addPage(copiedPage);

    const pdfBytes = await thumbnailDoc.save();

    // Convert to base64 for display
    const base64 = btoa(String.fromCharCode(...pdfBytes));
    return `data:application/pdf;base64,${base64}`;
  } catch (error) {
    console.error("Failed to generate thumbnail:", error);
    return "/placeholder-page.png"; // Fallback
  }
}

/**
 * Combine selected pages into a new PDF
 */
export async function combinePDFPages(
  pages: PDFPageInfo[]
): Promise<Uint8Array> {
  const combinedDoc = await PDFDocument.create();

  for (const pageInfo of pages) {
    if (pageInfo.pdfDoc && pageInfo.originalPage) {
      // Copy the page from its source document
      const [copiedPage] = await combinedDoc.copyPages(pageInfo.pdfDoc, [
        pageInfo.pageNumber - 1,
      ]);
      combinedDoc.addPage(copiedPage);
    }
  }

  return await combinedDoc.save();
}

/**
 * Rotate a page
 */
export async function rotatePage(
  pageInfo: PDFPageInfo,
  rotation: 90 | 180 | 270
): Promise<PDFPageInfo> {
  if (!pageInfo.originalPage) return pageInfo;

  // Create a new document with the rotated page
  const newDoc = await PDFDocument.create();
  const [copiedPage] = await newDoc.copyPages(pageInfo.pdfDoc!, [
    pageInfo.pageNumber - 1,
  ]);
  copiedPage.setRotation(degrees(rotation));
  newDoc.addPage(copiedPage);

  return {
    ...pageInfo,
    pdfDoc: newDoc,
    originalPage: newDoc.getPage(0),
  };
}

/**
 * Insert pages at specific position
 */
export async function insertPagesAtPosition(
  targetDoc: PDFDocument,
  sourcePages: PDFPageInfo[],
  position: number
): Promise<PDFDocument> {
  const newDoc = await PDFDocument.create();
  const targetPageCount = targetDoc.getPageCount();

  // Copy pages before insertion point
  if (position > 0) {
    const beforePages = await newDoc.copyPages(
      targetDoc,
      Array.from({ length: position }, (_, i) => i)
    );
    beforePages.forEach((page) => newDoc.addPage(page));
  }

  // Insert new pages
  for (const pageInfo of sourcePages) {
    if (pageInfo.pdfDoc) {
      const [copiedPage] = await newDoc.copyPages(pageInfo.pdfDoc, [
        pageInfo.pageNumber - 1,
      ]);
      newDoc.addPage(copiedPage);
    }
  }

  // Copy pages after insertion point
  if (position < targetPageCount) {
    const afterPages = await newDoc.copyPages(
      targetDoc,
      Array.from({ length: targetPageCount - position }, (_, i) => i + position)
    );
    afterPages.forEach((page) => newDoc.addPage(page));
  }

  return newDoc;
}

/**
 * Remove pages from PDF
 */
export async function removePagesFromPDF(
  sourceDoc: PDFDocument,
  pageIndicesToRemove: number[]
): Promise<PDFDocument> {
  const newDoc = await PDFDocument.create();
  const totalPages = sourceDoc.getPageCount();

  // Get indices of pages to keep
  const pagesToKeep = Array.from({ length: totalPages }, (_, i) => i).filter(
    (i) => !pageIndicesToRemove.includes(i)
  );

  // Copy pages to keep
  const copiedPages = await newDoc.copyPages(sourceDoc, pagesToKeep);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return newDoc;
}

/**
 * Reorder pages in PDF
 */
export async function reorderPDFPages(
  sourceDoc: PDFDocument,
  newOrder: number[]
): Promise<PDFDocument> {
  const newDoc = await PDFDocument.create();

  // Copy pages in new order
  const copiedPages = await newDoc.copyPages(sourceDoc, newOrder);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return newDoc;
}

/**
 * Extract specific pages from PDF
 */
export async function extractPagesFromPDF(
  sourceDoc: PDFDocument,
  pageIndices: number[]
): Promise<PDFDocument> {
  const newDoc = await PDFDocument.create();

  const copiedPages = await newDoc.copyPages(sourceDoc, pageIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return newDoc;
}
