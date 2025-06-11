// components/pdf-generator.tsx
"use client";

import { useCallback } from "react";

interface PhotoGridItem {
  id: string;
  name: string;
  url: string;
  size?: number;
  source: "upload" | "simpro";
}

interface PDFGeneratorProps {
  photos: PhotoGridItem[];
  settings: {
    photosPerPage: number;
    paperSize: "A4" | "Letter";
    orientation: "portrait" | "landscape";
    spacing: number;
  };
}

export const usePDFGenerator = () => {
  const generatePDF = useCallback(async (props: PDFGeneratorProps) => {
    const { photos, settings } = props;

    if (photos.length === 0) {
      alert("No photos to export");
      return;
    }

    console.log("Starting PDF generation with", photos.length, "photos");

    try {
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import("html2pdf.js")).default;

      // Create a temporary container for PDF content
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "210mm"; // A4 width
      container.style.backgroundColor = "white";
      document.body.appendChild(container);

      // Calculate layout
      const { photosPerPage, spacing } = settings;
      const cols = Math.ceil(Math.sqrt(photosPerPage));
      const rows = Math.ceil(photosPerPage / cols);

      // CSS for PDF
      const styles = `
        <style>
          @page {
            margin: 20mm;
            size: ${settings.paperSize} ${settings.orientation};
          }
          
          .pdf-page {
            width: 100%;
            min-height: 250mm;
            page-break-after: always;
            display: flex;
            flex-direction: column;
            gap: ${spacing}mm;
            font-family: Arial, sans-serif;
          }
          
          .pdf-page:last-child {
            page-break-after: avoid;
          }
          
          .page-header {
            text-align: center;
            margin-bottom: 10mm;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5mm;
          }
          
          .photos-grid {
            display: grid;
            grid-template-columns: repeat(${cols}, 1fr);
            grid-template-rows: repeat(${rows}, 1fr);
            gap: ${spacing}mm;
            flex: 1;
          }
          
          .photo-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            break-inside: avoid;
          }
          
          .photo-container {
            width: 100%;
            aspect-ratio: 4/3;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .photo-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: cover;
            display: block;
          }
          
          .photo-caption {
            margin-top: 2mm;
            font-size: 10pt;
            color: #333;
            word-wrap: break-word;
            max-width: 100%;
          }
          
          .photo-details {
            font-size: 8pt;
            color: #666;
            margin-top: 1mm;
          }
        </style>
      `;

      // Split photos into pages
      const totalPages = Math.ceil(photos.length / photosPerPage);
      let htmlContent = styles;

      for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        const startIdx = pageNum * photosPerPage;
        const endIdx = Math.min(startIdx + photosPerPage, photos.length);
        const pagePhotos = photos.slice(startIdx, endIdx);

        htmlContent += `
          <div class="pdf-page">
            <div class="page-header">
              <h1>Photo Grid Report</h1>
              <p>Page ${pageNum + 1} of ${totalPages} • ${
          photos.length
        } Photos Total</p>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="photos-grid">
        `;

        // Add photos to this page
        for (const photo of pagePhotos) {
          const photoSize = photo.size
            ? `${Math.round(photo.size / 1024)}KB`
            : "";
          const photoSource = photo.source === "simpro" ? "SimPRO" : "Upload";

          htmlContent += `
            <div class="photo-item">
              <div class="photo-container">
                <img class="photo-image" src="${photo.url}" alt="${photo.name}" />
              </div>
              <div class="photo-caption">${photo.name}</div>
              <div class="photo-details">${photoSource} ${photoSize}</div>
            </div>
          `;
        }

        // Fill remaining grid cells with empty space
        const emptyCells = photosPerPage - pagePhotos.length;
        for (let i = 0; i < emptyCells; i++) {
          htmlContent += '<div class="photo-item"></div>';
        }

        htmlContent += `
            </div>
          </div>
        `;
      }

      container.innerHTML = htmlContent;

      // Wait for all images to load
      console.log("Waiting for images to load...");
      const images = container.querySelectorAll("img");
      const imagePromises = Array.from(images).map((img) => {
        return new Promise((resolve, reject) => {
          if (img.complete) {
            resolve(img);
          } else {
            img.onload = () => resolve(img);
            img.onerror = () => {
              console.warn("Failed to load image:", img.src);
              resolve(img); // Continue even if image fails
            };

            // Timeout after 10 seconds
            setTimeout(() => {
              console.warn("Image load timeout:", img.src);
              resolve(img);
            }, 10000);
          }
        });
      });

      await Promise.all(imagePromises);
      console.log("All images loaded, generating PDF...");

      // PDF options
      const opt = {
        margin: 0,
        filename: `photo-grid-${photos.length}items-${totalPages}pages.pdf`,
        image: {
          type: "jpeg",
          quality: 0.92,
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          width: container.scrollWidth,
          height: container.scrollHeight,
        },
        jsPDF: {
          unit: "mm",
          format: settings.paperSize.toLowerCase(),
          orientation: settings.orientation,
          compress: true,
        },
        pagebreak: {
          mode: "avoid-all",
          before: ".pdf-page",
        },
      };

      // Generate and download PDF
      await html2pdf().set(opt).from(container).save();

      console.log("PDF generated successfully!");

      // Clean up
      document.body.removeChild(container);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert(
        `PDF generation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, []);

  return { generatePDF };
};

// Usage example component
export default function PDFDownloadButton({
  photos,
  settings,
}: PDFGeneratorProps) {
  const { generatePDF } = usePDFGenerator();

  const handleDownload = () => {
    generatePDF({ photos, settings });
  };

  return (
    <button
      onClick={handleDownload}
      disabled={photos.length === 0}
      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Download PDF ({photos.length} photos)
    </button>
  );
}
