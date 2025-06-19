"use client";

import React, { useState } from "react";
import AppLayout from "@/app/layout";
import ErrorMessage from "@/components/ui/ErrorMessage";
import HeaderActions from "@/components/ui/HeaderActions";
import SimproImport from "@/components/photo/SimproImport";
import FileUpload from "@/components/photo/FileUpload";
import PhotoGrid from "@/components/photo/PhotoGrid";
import type { Photo } from "@/types";

const PhotoGridApp: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [jobNumber, setJobNumber] = useState("");

  // Natural sorting function for photos
  const naturalSort = (a: string, b: string): number => {
    const chunkify = (str: string) => {
      return str.split(/(\d+)/).filter((chunk) => chunk !== "");
    };

    const chunksA = chunkify(a);
    const chunksB = chunkify(b);

    for (let i = 0; i < Math.max(chunksA.length, chunksB.length); i++) {
      const chunkA = chunksA[i] || "";
      const chunkB = chunksB[i] || "";

      if (/^\d+$/.test(chunkA) && /^\d+$/.test(chunkB)) {
        const numA = parseInt(chunkA, 10);
        const numB = parseInt(chunkB, 10);
        if (numA !== numB) {
          return numA - numB;
        }
      } else {
        const result = chunkA.localeCompare(chunkB);
        if (result !== 0) {
          return result;
        }
      }
    }
    return 0;
  };

  const sortedPhotos = React.useMemo(() => {
    return [...photos].sort((a, b) => naturalSort(a.name, b.name));
  }, [photos]);

  const handlePhotosImported = (newPhotos: Photo[]) => {
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handlePhotosUploaded = (newPhotos: Photo[]) => {
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handlePhotoRemove = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const handlePhotoRename = (id: string, newName: string) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id ? { ...photo, name: newName } : photo
      )
    );
  };

  const generatePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Photo Report</title>
          <style>
            @page { 
              margin: 15mm; 
              size: A4;
              margin-top: 0;
              margin-bottom: 0;
              @top-left { content: none; }
              @top-center { content: none; }
              @top-right { content: none; }
              @bottom-left { content: none; }
              @bottom-center { content: none; }
              @bottom-right { content: none; }
            }
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Poppins', Arial, sans-serif;
              font-weight: 200;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .grid { 
              display: grid; 
              grid-template-columns: repeat(4, 1fr); 
              gap: 1rem; 
              padding: 1rem;
            }
            .photo-item { 
              position: relative;
            }
            .photo-container { 
              aspect-ratio: 1;
              background: #f3f4f6 !important;
              border-radius: 0.5rem;
              overflow: hidden;
            }
            .photo-container img { 
              width: 100%; 
              height: 100%; 
              object-fit: cover; 
            }
            .caption { 
              background: #f3f4f6 !important;
              border-radius: 0.5rem;
              padding: 0.5rem 0.75rem;
              margin-top: 0.5rem;
              text-align: center;
              font-size: 0.75rem;
              font-weight: 200;
              color: #374151 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @media print {
              .grid { 
                grid-template-columns: repeat(3, 1fr); 
                gap: 0.75rem; 
              }
              .caption {
                font-size: 0.7rem;
                padding: 0.4rem 0.6rem;
                background: #f3f4f6 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .photo-container {
                background: #f3f4f6 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="grid">
            ${sortedPhotos
              .map(
                (photo) => `
              <div class="photo-item">
                <div class="photo-container">
                  <img src="${photo.url}" alt="${photo.name}" />
                </div>
                <div class="caption">${photo.name.replace(
                  /\.[^/.]+$/,
                  ""
                )}</div>
              </div>
            `
              )
              .join("")}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePDFEditor = () => {
    // Add PDF Editor functionality here when needed
    console.log("PDF Editor clicked - implement when ready");
  };

  const clearAll = () => {
    setPhotos([]);
    setJobNumber("");
    setError(null);
  };

  const headerActions = (
    <HeaderActions
      hasPhotos={photos.length > 0}
      hasJobNumber={jobNumber.trim().length > 0}
      onQuickPrint={generatePrint}
      onPDFEditor={handlePDFEditor} // ADD THIS
      onClearAll={clearAll}
    />
  );

  return (
    <AppLayout actions={headerActions}>
      {error && <ErrorMessage message={error} />}

      <SimproImport
        jobNumber={jobNumber}
        onJobNumberChange={setJobNumber}
        onPhotosImported={handlePhotosImported}
        onError={setError}
      />

      <FileUpload onPhotosUploaded={handlePhotosUploaded} />

      <PhotoGrid
        photos={sortedPhotos} // USE SORTED PHOTOS HERE
        onPhotoRemove={handlePhotoRemove}
        onPhotoRename={handlePhotoRename}
      />
    </AppLayout>
  );
};

export default PhotoGridApp;
