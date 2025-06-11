// PhotoGridApp.tsx
"use client";

import React, { useState, useRef, useCallback } from "react";
import { Download, X, Settings, Building2, AlertCircle } from "lucide-react";

// Import types
import { PhotoGridItem, PhotoGridOptions, JobInfo, SimproJob } from "../types";

// Import components
import { PDFSettingsPanel } from "./PDFSettingsPanel";
import { PhotoUploader } from "./PhotoUploader";
import { SimproImporter } from "./SimproImporter";
import { PhotoGrid } from "./PhotoGrid";

// Import hook
import { usePDFGenerator } from "./pdf-generator";

const PhotoGridApp = () => {
  // State management
  const [photos, setPhotos] = useState<PhotoGridItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [currentJob, setCurrentJob] = useState<SimproJob | null>(null);

  // PDF generation options
  const [pdfOptions, setPdfOptions] = useState<PhotoGridOptions>({
    photosPerPage: 6,
    includeFilenames: true,
    fontSize: "medium",
    gridCols: 3,
    paperSize: "A4",
    orientation: "portrait",
  });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { generatePDF } = usePDFGenerator();

  // Error handling
  const handleError = useCallback((message: string) => {
    console.error(message);
    setError(message);
    setTimeout(() => setError(null), 5000);
  }, []);

  // Photo management
  const handlePhotosAdded = useCallback((newPhotos: PhotoGridItem[]) => {
    setPhotos((prev) => [...prev, ...newPhotos]);
  }, []);

  const handlePhotosImported = useCallback(
    (simproPhotos: PhotoGridItem[], job: SimproJob) => {
      setPhotos((prev) => [...prev, ...simproPhotos]);
      setCurrentJob(job);
    },
    []
  );

  const removePhoto = useCallback((photoId: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  }, []);

  const clearAllPhotos = useCallback(() => {
    setPhotos([]);
    setCurrentJob(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const openFileUploader = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // PDF generation
  const handleDownloadPDF = useCallback(async () => {
    if (photos.length === 0) {
      handleError("No photos to generate PDF");
      return;
    }

    setLoading(true);

    try {
      const jobInfo: JobInfo = {
        name: currentJob?.Name,
        number: currentJob?.ID,
      };

      await generatePDF(photos, pdfOptions, jobInfo);
    } catch (error) {
      handleError(
        error instanceof Error
          ? error.message
          : "PDF generation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [photos, pdfOptions, currentJob, generatePDF, handleError]);

  // Utility functions
  const getPageCount = useCallback(() => {
    return Math.ceil(photos.length / pdfOptions.photosPerPage);
  }, [photos.length, pdfOptions.photosPerPage]);

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                RAS-VERTEX
              </h1>
              <p className="text-gray-600 mt-2">
                Building Inspection Photo Grid Generator
              </p>
            </div>

            {photos.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {loading
                    ? "Generating..."
                    : `Download PDF (${getPageCount()} page${
                        getPageCount() > 1 ? "s" : ""
                      })`}
                </button>

                <button
                  onClick={clearAllPhotos}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      <PDFSettingsPanel
        options={pdfOptions}
        onChange={setPdfOptions}
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Main Content */}
      {photos.length === 0 ? (
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* SimPRO Importer */}
          <div className="mb-8">
            <SimproImporter
              onPhotosImported={handlePhotosImported}
              onError={handleError}
              loading={loading}
            />
          </div>

          {/* Photo Uploader */}
          <PhotoUploader
            onPhotosAdded={handlePhotosAdded}
            onError={handleError}
            loading={loading}
          />
        </div>
      ) : (
        /* Photo Grid Display */
        <PhotoGrid
          photos={photos}
          options={pdfOptions}
          jobInfo={
            currentJob
              ? { name: currentJob.Name, number: currentJob.ID }
              : undefined
          }
          onRemovePhoto={removePhoto}
          onAddMorePhotos={openFileUploader}
        />
      )}

      {/* Hidden file input for additional uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) {
            setLoading(true);
            // Handle file upload through PhotoUploader logic
            const photoPromises = files.map((file) => {
              return new Promise<PhotoGridItem>((resolve, reject) => {
                if (!file.type.startsWith("image/")) {
                  reject(new Error(`${file.name} is not a valid image file`));
                  return;
                }

                if (file.size > 10 * 1024 * 1024) {
                  reject(
                    new Error(`${file.name} is too large. Maximum size is 10MB`)
                  );
                  return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                  resolve({
                    id: `upload_${Date.now()}_${Math.random()
                      .toString(36)
                      .substr(2, 9)}`,
                    name: file.name,
                    url: e.target?.result as string,
                    size: file.size,
                    source: "upload",
                  });
                };
                reader.onerror = () =>
                  reject(new Error(`Failed to read ${file.name}`));
                reader.readAsDataURL(file);
              });
            });

            Promise.all(photoPromises)
              .then(handlePhotosAdded)
              .catch((err) => handleError(err.message))
              .finally(() => setLoading(false));
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default PhotoGridApp;
