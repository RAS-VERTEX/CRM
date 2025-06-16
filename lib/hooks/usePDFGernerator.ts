import { useCallback } from "react";
import { PhotoGridItem, PhotoGridOptions, JobInfo } from "../../types";

export const usePDFGenerator = () => {
  const generatePDF = useCallback(
    async (
      photos: PhotoGridItem[],
      options: PhotoGridOptions,
      jobInfo?: JobInfo
    ) => {
      if (photos.length === 0) {
        throw new Error("No photos to generate PDF");
      }

      console.log(`Generating PDF with ${photos.length} photos...`);

      try {
        // Dynamic import jsPDF
        const { jsPDF } = await import("jspdf");

        // Create PDF document
        const pdf = new jsPDF({
          orientation: options.orientation || "portrait",
          unit: "mm",
          format: "a4",
        });

        // A4 dimensions in mm
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const usableWidth = pageWidth - margin * 2;
        const usableHeight = pageHeight - margin * 2;

        // Load all images first
        console.log("Loading images...");
        const loadedImages = await loadAllImages(photos);

        // Calculate grid layout
        const cols = options.gridCols || 3;
        const rows = Math.ceil(options.photosPerPage / cols);
        const cellWidth = usableWidth / cols;
        const cellHeight = (usableHeight - 40) / rows; // Reserve space for header

        let currentPage = 1;
        let imageIndex = 0;

        while (imageIndex < loadedImages.length) {
          // Add header to each page
          addPageHeader(
            pdf,
            currentPage,
            Math.ceil(loadedImages.length / options.photosPerPage),
            jobInfo,
            margin
          );

          // Add images to current page
          const startY = margin + 30; // After header
          let currentRow = 0;
          let currentCol = 0;

          for (
            let i = 0;
            i < options.photosPerPage && imageIndex < loadedImages.length;
            i++
          ) {
            const image = loadedImages[imageIndex];

            // Calculate position
            const x = margin + currentCol * cellWidth + 5; // Small padding
            const y = startY + currentRow * cellHeight + 5;
            const maxImageWidth = cellWidth - 10; // Leave padding
            const maxImageHeight = cellHeight - 20; // Leave space for filename

            try {
              // Add image to PDF
              const imgDimensions = calculateImageDimensions(
                image.naturalWidth || 200,
                image.naturalHeight || 200,
                maxImageWidth,
                maxImageHeight
              );

              pdf.addImage(
                image.dataUrl,
                "JPEG",
                x + (maxImageWidth - imgDimensions.width) / 2, // Center horizontally
                y,
                imgDimensions.width,
                imgDimensions.height
              );

              // Add filename if enabled
              if (options.includeFilenames) {
                const fontSize =
                  options.fontSize === "small"
                    ? 8
                    : options.fontSize === "large"
                    ? 12
                    : 10;
                pdf.setFontSize(fontSize);
                pdf.setTextColor(51, 51, 51);

                const filename = removeFileExtension(image.photo.name);
                const textY = y + imgDimensions.height + 8;

                // Wrap text if too long
                const textLines = pdf.splitTextToSize(filename, maxImageWidth);
                pdf.text(textLines, x, textY);
              }
            } catch (imgError) {
              console.warn(`Failed to add image ${imageIndex}:`, imgError);

              // Add placeholder rectangle
              pdf.setDrawColor(200, 200, 200);
              pdf.setFillColor(245, 245, 245);
              pdf.rect(x, y, maxImageWidth, maxImageHeight / 2, "FD");

              pdf.setFontSize(10);
              pdf.setTextColor(150, 150, 150);
              pdf.text("Image failed to load", x + 5, y + 15);
            }

            imageIndex++;
            currentCol++;

            if (currentCol >= cols) {
              currentCol = 0;
              currentRow++;
            }
          }

          // Add new page if more images
          if (imageIndex < loadedImages.length) {
            pdf.addPage();
            currentPage++;
          }
        }

        // Save the PDF
        const filename = generateFilename(photos.length, currentPage, jobInfo);
        pdf.save(filename);

        console.log("PDF generated successfully!");
      } catch (error) {
        console.error("PDF generation failed:", error);
        throw error;
      }
    },
    []
  );

  return { generatePDF };
};

// Helper functions
async function loadAllImages(photos: PhotoGridItem[]): Promise<LoadedImage[]> {
  const loadPromises = photos.map((photo, index) => loadImage(photo, index));
  const results = await Promise.allSettled(loadPromises);

  return results
    .filter(
      (result): result is PromiseFulfilledResult<LoadedImage> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value);
}

interface LoadedImage {
  photo: PhotoGridItem;
  dataUrl: string;
  naturalWidth: number;
  naturalHeight: number;
}

async function loadImage(
  photo: PhotoGridItem,
  index: number
): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        // Create canvas to convert to data URL if needed
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx!.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

        resolve({
          photo,
          dataUrl,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
      } catch (error) {
        console.warn(`Failed to process image ${index}:`, error);
        reject(error);
      }
    };

    img.onerror = () => {
      console.warn(`Failed to load image ${index}:`, photo.url);
      reject(new Error(`Failed to load image: ${photo.name}`));
    };

    // Handle different URL types
    if (photo.url.startsWith("data:")) {
      img.src = photo.url;
    } else {
      // For external URLs, try to load directly first
      img.src = photo.url;
    }

    // Timeout after 15 seconds
    setTimeout(() => {
      reject(new Error(`Image load timeout: ${photo.name}`));
    }, 15000);
  });
}

function addPageHeader(
  pdf: any,
  pageNum: number,
  totalPages: number,
  jobInfo?: JobInfo,
  margin: number
) {
  // Title
  pdf.setFontSize(16);
  pdf.setTextColor(51, 51, 51);
  pdf.setFont(undefined, "bold");

  const title = jobInfo?.name ? `Job ${jobInfo.name}` : "Photo Grid Report";
  pdf.text(title, margin, margin + 10);

  // Page info
  pdf.setFontSize(10);
  pdf.setTextColor(102, 102, 102);
  pdf.setFont(undefined, "normal");

  const pageInfo = `Page ${pageNum} of ${totalPages} | ${new Date().toLocaleDateString()}`;
  pdf.text(pageInfo, margin, margin + 18);

  // Line under header
  pdf.setDrawColor(51, 51, 51);
  pdf.setLineWidth(0.5);
  pdf.line(
    margin,
    margin + 25,
    pdf.internal.pageSize.getWidth() - margin,
    margin + 25
  );
}

function calculateImageDimensions(
  naturalWidth: number,
  naturalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight);

  return {
    width: naturalWidth * ratio,
    height: naturalHeight * ratio,
  };
}

function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}

function generateFilename(
  photoCount: number,
  pageCount: number,
  jobInfo?: JobInfo
): string {
  const timestamp = new Date().toISOString().split("T")[0];
  const jobPart = jobInfo?.number ? `job-${jobInfo.number}-` : "";
  return `${jobPart}photos-${photoCount}items-${pageCount}pages-${timestamp}.pdf`;
}
