// hooks/usePDFGenerator.ts
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
        // Dynamic import to avoid SSR issues
        const html2pdf = (await import("html2pdf.js")).default;

        // Calculate pages
        const totalPages = Math.ceil(photos.length / options.photosPerPage);

        // Pre-process images to base64 to avoid loading issues
        console.log("Preprocessing images...");
        const processedPhotos = await preprocessImages(photos);

        // Generate HTML content
        const htmlContent = generateHTMLContent(
          processedPhotos,
          options,
          totalPages,
          jobInfo
        );

        // Create temporary container
        const container = createPDFContainer(htmlContent);

        try {
          // Wait for images to load
          await waitForImages(container);

          // Configure PDF options
          const pdfConfig = {
            margin: 0,
            filename: generateFilename(photos.length, totalPages, jobInfo),
            image: {
              type: "jpeg",
              quality: 0.85,
            },
            html2canvas: {
              scale: 1.5,
              useCORS: true,
              allowTaint: true,
              backgroundColor: "#ffffff",
              logging: false,
              width: 794, // A4 width in pixels at 96 DPI
              height: 1123, // A4 height in pixels at 96 DPI
            },
            jsPDF: {
              unit: "mm",
              format: "a4",
              orientation: options.orientation,
            },
          };

          // Generate PDF
          await html2pdf().set(pdfConfig).from(container).save();

          console.log("PDF generated successfully!");
        } finally {
          // Cleanup
          document.body.removeChild(container);
        }
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
async function preprocessImages(
  photos: PhotoGridItem[]
): Promise<PhotoGridItem[]> {
  return Promise.all(
    photos.map(async (photo, index) => {
      try {
        if (photo.url.startsWith("data:")) {
          return photo; // Already base64
        }

        // Convert to base64
        const response = await fetch(photo.url);
        const blob = await response.blob();

        return new Promise<PhotoGridItem>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              ...photo,
              url: reader.result as string,
            });
          };
          reader.onerror = () => {
            console.warn(
              `Failed to convert image ${index}, using original URL`
            );
            resolve(photo);
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.warn(`Failed to preprocess image ${index}:`, error);
        return photo;
      }
    })
  );
}

function generateHTMLContent(
  photos: PhotoGridItem[],
  options: PhotoGridOptions,
  totalPages: number,
  jobInfo?: JobInfo
): string {
  const { photosPerPage, gridCols, fontSize, includeFilenames } = options;

  const fontSizeMap = {
    small: "8px",
    medium: "10px",
    large: "12px",
  };

  let htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; background: white;">
  `;

  // Generate pages
  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    const startIdx = pageIndex * photosPerPage;
    const endIdx = Math.min(startIdx + photosPerPage, photos.length);
    const pagePhotos = photos.slice(startIdx, endIdx);

    htmlContent += `
      <div style="
        width: 210mm;
        min-height: 297mm;
        padding: 15mm;
        box-sizing: border-box;
        background: white;
        ${pageIndex < totalPages - 1 ? "page-break-after: always;" : ""}
      ">
        <!-- Header -->
        <div style="
          text-align: center;
          margin-bottom: 15mm;
          border-bottom: 2px solid #333;
          padding-bottom: 8mm;
        ">
          <h1 style="
            font-size: 20px;
            margin: 0 0 5px 0;
            color: #333;
            font-weight: bold;
          ">${jobInfo?.name ? `Job ${jobInfo.name}` : "Photo Grid Report"}</h1>
          <p style="
            font-size: 12px;
            margin: 0;
            color: #666;
          ">
            Page ${pageIndex + 1} of ${totalPages} | 
            Photos ${startIdx + 1}-${endIdx} of ${photos.length} | 
            ${new Date().toLocaleDateString()}
          </p>
        </div>
        
        <!-- Photo Grid -->
        <div style="
          display: grid;
          grid-template-columns: repeat(${gridCols}, 1fr);
          gap: 8mm;
          width: 100%;
        ">
    `;

    // Add photos
    pagePhotos.forEach((photo) => {
      htmlContent += `
        <div style="
          border: 1px solid #ddd;
          border-radius: 6px;
          overflow: hidden;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          page-break-inside: avoid;
        ">
          <div style="
            padding: 4mm;
            text-align: center;
            height: 60mm;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f9f9f9;
          ">
            <img 
              src="${photo.url}" 
              alt="${photo.name}"
              style="
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 3px;
              "
            />
          </div>
          ${
            includeFilenames
              ? `
            <div style="
              padding: 3mm 4mm;
              font-size: ${fontSizeMap[fontSize]};
              color: #333;
              background: #f5f5f5;
              border-top: 1px solid #eee;
              word-break: break-word;
              line-height: 1.3;
              min-height: 8mm;
              display: flex;
              align-items: center;
            ">
              ${removeFileExtension(photo.name)}
            </div>
          `
              : ""
          }
        </div>
      `;
    });

    htmlContent += `
        </div>
      </div>
    `;
  }

  htmlContent += "</div>";
  return htmlContent;
}

function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}

function createPDFContainer(htmlContent: string): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = htmlContent;
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px"; // A4 width at 96 DPI
  container.style.background = "white";

  document.body.appendChild(container);
  return container;
}

async function waitForImages(container: HTMLElement): Promise<void> {
  const images = container.querySelectorAll("img");
  console.log(`Waiting for ${images.length} images to load...`);

  const imagePromises = Array.from(images).map((img, index) => {
    return new Promise<void>((resolve) => {
      if (img.complete && img.naturalHeight !== 0) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        console.warn(`Image ${index} load timeout`);
        resolve();
      }, 10000);

      img.onload = () => {
        clearTimeout(timeout);
        resolve();
      };

      img.onerror = () => {
        clearTimeout(timeout);
        console.warn(`Image ${index} failed to load`);
        resolve();
      };
    });
  });

  await Promise.all(imagePromises);

  // Additional settling time for DOM stability
  await new Promise((resolve) => setTimeout(resolve, 1000));
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
