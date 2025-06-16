import { useCallback } from "react";

// Define types locally to avoid import issues
interface PhotoGridItem {
  id: string;
  name: string;
  url: string;
  size?: number;
  source?: "simpro" | "upload";
  simproData?: any;
}

interface PhotoGridOptions {
  photosPerPage: number;
  gridCols: number;
  fontSize: "small" | "medium" | "large";
  includeFilenames: boolean;
  orientation?: "portrait" | "landscape";
}

interface JobInfo {
  name?: string;
  number?: string;
}

export const usePDFGenerator = () => {
  const generatePDF = useCallback(
    async (
      photos: PhotoGridItem[],
      options: PhotoGridOptions,
      jobInfo?: JobInfo
    ) => {
      console.log("=== PDF GENERATION START ===");
      console.log("Photos received:", photos.length);
      console.log("Options:", options);

      if (photos.length === 0) {
        throw new Error("No photos to generate PDF");
      }

      try {
        // Import jsPDF dynamically
        console.log("Importing jsPDF...");
        const jsPDF = (await import("jspdf")).jsPDF;
        console.log("jsPDF imported successfully");

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

        // Calculate layout
        const cols = options.gridCols || 3;
        const photosPerPage = options.photosPerPage || 9;
        const rows = Math.ceil(photosPerPage / cols);
        const cellWidth = usableWidth / cols;
        const cellHeight = (usableHeight - 40) / rows;

        let currentPage = 1;
        let imageIndex = 0;
        const totalPages = Math.ceil(photos.length / photosPerPage);

        while (imageIndex < photos.length) {
          console.log(`\n--- Creating page ${currentPage} ---`);

          // Add header with Bebas-style
          addBebasStyleHeader(pdf, currentPage, totalPages, jobInfo, margin);

          // Process images for current page
          const startY = margin + 35;
          let currentRow = 0;
          let currentCol = 0;

          const pageEndIndex = Math.min(
            imageIndex + photosPerPage,
            photos.length
          );

          for (let i = imageIndex; i < pageEndIndex; i++) {
            const photo = photos[i];
            console.log(`Processing image ${i}: ${photo.name}`);

            // Calculate position
            const x = margin + currentCol * cellWidth + 4;
            const y = startY + currentRow * cellHeight + 4;
            const maxImageWidth = cellWidth - 8;
            const maxImageHeight =
              cellHeight - (options.includeFilenames ? 20 : 8);

            try {
              // Handle base64 data URLs
              let imageData = photo.url;

              if (!photo.url.startsWith("data:")) {
                imageData = await convertUrlToBase64(photo.url);
              }

              // Add rounded image
              await addRoundedImage(
                pdf,
                imageData,
                x,
                y,
                maxImageWidth,
                maxImageHeight
              );

              console.log(`Rounded image ${photo.name} added successfully`);

              // Add filename with Poppins ExtraLight style
              if (options.includeFilenames) {
                addPoppinsStyleText(
                  pdf,
                  photo.name,
                  x,
                  y + maxImageHeight + 6,
                  maxImageWidth,
                  options.fontSize
                );
              }
            } catch (imgError) {
              console.error(`Failed to add image ${photo.name}:`, imgError);

              // Add rounded placeholder
              addRoundedPlaceholder(
                pdf,
                x,
                y,
                maxImageWidth,
                maxImageHeight,
                photo.name
              );
            }

            // Move to next position
            currentCol++;
            if (currentCol >= cols) {
              currentCol = 0;
              currentRow++;
            }
          }

          imageIndex = pageEndIndex;

          // Add new page if more images
          if (imageIndex < photos.length) {
            pdf.addPage();
            currentPage++;
          }
        }

        // Generate filename and save
        const filename = generateFilename(photos.length, totalPages, jobInfo);
        console.log(`Saving PDF as: ${filename}`);

        pdf.save(filename);
        console.log("=== PDF GENERATION SUCCESS ===");
      } catch (error) {
        console.error("=== PDF GENERATION FAILED ===", error);
        throw error;
      }
    },
    []
  );

  return { generatePDF };
};

// Helper functions
async function convertUrlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to convert URL to base64:", error);
    throw error;
  }
}

function addBebasStyleHeader(
  pdf: any,
  pageNum: number,
  totalPages: number,
  jobInfo?: JobInfo,
  margin: number
) {
  // BEBAS NEUE STYLE - Bold, condensed, uppercase
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22); // Larger, more condensed feel
  pdf.setTextColor(20, 20, 20); // Deep black

  const title = jobInfo?.name
    ? `JOB ${jobInfo.name.toUpperCase()}`
    : "PHOTO GRID REPORT";
  pdf.text(title, margin, margin + 12);

  // Subtitle - smaller, spaced out
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(120, 120, 120);

  const pageInfo = `PAGE ${pageNum} OF ${totalPages}  •  ${new Date()
    .toLocaleDateString()
    .toUpperCase()}  •  PHOTOS ${(pageNum - 1) * 9 + 1}-${Math.min(
    pageNum * 9,
    totalPages * 9
  )}`;
  pdf.text(pageInfo, margin, margin + 20);

  // Bold blue accent line
  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(1.5);
  pdf.line(
    margin,
    margin + 28,
    pdf.internal.pageSize.getWidth() - margin,
    margin + 28
  );
}

async function addRoundedImage(
  pdf: any,
  imageData: string,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number
) {
  // Calculate image dimensions
  const imgDimensions = calculateImageDimensions(200, 200, maxWidth, maxHeight);

  // Create a canvas to make the image rounded
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size
  canvas.width = imgDimensions.width * 3; // Higher resolution
  canvas.height = imgDimensions.height * 3;

  // Create rounded clipping path
  const radius = 15; // 12px equivalent
  ctx!.beginPath();
  ctx!.roundRect(0, 0, canvas.width, canvas.height, radius);
  ctx!.clip();

  // Load and draw the image
  const img = new Image();
  img.crossOrigin = "anonymous";

  return new Promise<void>((resolve, reject) => {
    img.onload = () => {
      // Draw image to fill the rounded area
      ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert canvas to base64
      const roundedImageData = canvas.toDataURL("image/jpeg", 0.9);

      // Add the rounded image to PDF
      pdf.addImage(
        roundedImageData,
        "JPEG",
        x + (maxWidth - imgDimensions.width) / 2,
        y,
        imgDimensions.width,
        imgDimensions.height
      );

      resolve();
    };

    img.onerror = () => reject(new Error("Failed to load image for rounding"));
    img.src = imageData;
  });
}

function addPoppinsStyleText(
  pdf: any,
  filename: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: "small" | "medium" | "large"
) {
  // POPPINS EXTRALIGHT STYLE - Light, clean, modern
  pdf.setFont("helvetica", "normal"); // Closest to light weight
  const size = getPoppinsFontSize(fontSize);
  pdf.setFontSize(size);
  pdf.setTextColor(85, 85, 85); // Softer gray for light feel

  const cleanName = removeFileExtension(filename);

  // Center the text
  const textWidth = pdf.getTextWidth(cleanName);
  const textX = textWidth > maxWidth ? x : x + (maxWidth - textWidth) / 2;

  // Add some letter spacing feel by using clean text
  const lines = pdf.splitTextToSize(cleanName, maxWidth);
  pdf.text(lines, textX, y);
}

async function addRoundedPlaceholder(
  pdf: any,
  x: number,
  y: number,
  width: number,
  height: number,
  filename: string
) {
  // Create rounded placeholder using canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = width * 3;
  canvas.height = height * 3;

  // Fill with error color
  ctx!.fillStyle = "#EF4444";
  ctx!.beginPath();
  ctx!.roundRect(0, 0, canvas.width, canvas.height, 15);
  ctx!.fill();

  // Add error text
  ctx!.fillStyle = "white";
  ctx!.font = "bold 24px Arial";
  ctx!.textAlign = "center";
  ctx!.fillText("FAILED", canvas.width / 2, canvas.height / 2);

  const placeholderData = canvas.toDataURL("image/jpeg", 0.9);

  pdf.addImage(placeholderData, "JPEG", x, y, width, height);
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

function getPoppinsFontSize(size: "small" | "medium" | "large"): number {
  switch (size) {
    case "small":
      return 7;
    case "large":
      return 11;
    default:
      return 9;
  }
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
