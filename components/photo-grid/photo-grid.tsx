"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  Download,
  Grid,
  FileText,
  X,
  Settings,
  Building2,
  Search,
  AlertCircle,
  CheckCircle,
  Edit3,
} from "lucide-react";
import { usePDFGenerator } from "@/lib/hooks/usePDFGernerator";

interface PhotoGridItem {
  id: string;
  name: string;
  url: string;
  size: number;
  source: "upload" | "simpro";
  simproData?: any;
}

interface PhotoGridOptions {
  photosPerPage: number;
  includeFilenames: boolean;
  fontSize: "small" | "medium" | "large";
  gridCols: 2 | 3 | 4 | 6;
  paperSize: "A4" | "Letter";
  orientation: "portrait" | "landscape";
}

interface JobInfo {
  name?: string;
  number?: string;
}

const PhotoGridApp = () => {
  const [photos, setPhotos] = useState<PhotoGridItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobNumber, setJobNumber] = useState("");
  const [companyId, setCompanyId] = useState("0");
  const [currentJob, setCurrentJob] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Photo name editing state
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const [pdfOptions, setPdfOptions] = useState<PhotoGridOptions>({
    photosPerPage: 6,
    includeFilenames: true,
    fontSize: "medium",
    gridCols: 3,
    paperSize: "A4",
    orientation: "portrait",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { generatePDF } = usePDFGenerator();

  const handleError = useCallback((message: string, details?: any) => {
    console.error(message, details);
    setError(message);
    setTimeout(() => setError(null), 5000);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setLoading(true);
    setError(null);

    try {
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
              id: `upload_${Date.now()}_${Math.random()}`,
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

      const loadedPhotos = await Promise.all(photoPromises);
      setPhotos((prev) => [...prev, ...loadedPhotos]);
    } catch (err) {
      handleError(
        err instanceof Error ? err.message : "Failed to upload files"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSimproAttachments = async () => {
    if (!jobNumber.trim()) {
      handleError("Please enter a job number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/simpro/jobs/${jobNumber}/attachments?companyId=${companyId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch attachments: ${response.statusText}`);
      }

      const { attachments, job } = await response.json();
      setCurrentJob(job);

      const imageAttachments = attachments.filter((att: any) =>
        att.MimeType?.startsWith("image/")
      );

      if (imageAttachments.length === 0) {
        handleError("No image attachments found for this job");
        return;
      }

      const simproPhotos: PhotoGridItem[] = imageAttachments.map(
        (att: any) => ({
          id: `simpro_${att.ID}`,
          name: att.Filename,
          url: `data:${att.MimeType};base64,${att.Base64Data}`,
          size: att.FileSizeBytes,
          source: "simpro" as const,
          simproData: att,
        })
      );

      setPhotos((prev) => [...prev, ...simproPhotos]);
    } catch (err) {
      handleError(
        err instanceof Error
          ? err.message
          : "Failed to fetch SimPRO attachments"
      );
    } finally {
      setLoading(false);
    }
  };

  // Photo name editing functions
  const startEditingName = (photoId: string, currentName: string) => {
    setEditingPhotoId(photoId);
    setEditingName(removeExtension(currentName));
  };

  const savePhotoName = (photoId: string) => {
    if (editingName.trim()) {
      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === photoId
            ? {
                ...photo,
                name:
                  editingName.trim() +
                  (photo.name.includes(".")
                    ? "." + photo.name.split(".").pop()
                    : ""),
              }
            : photo
        )
      );
    }
    setEditingPhotoId(null);
    setEditingName("");
  };

  const cancelEditingName = () => {
    setEditingPhotoId(null);
    setEditingName("");
  };

  const removeExtension = (filename: string) => {
    return filename.replace(/\.[^/.]+$/, "");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getPageCount = () => {
    return Math.ceil(photos.length / pdfOptions.photosPerPage);
  };

  const downloadPDF = async () => {
    if (photos.length === 0) return;

    setLoading(true);
    console.log("=== STARTING PDF GENERATION ===");
    console.log("Photos to export:", photos.length);
    console.log("PDF Options:", pdfOptions);

    try {
      const jobInfo: JobInfo = {
        name: currentJob?.Name || jobNumber || undefined,
        number: jobNumber || undefined,
      };

      console.log("Job Info:", jobInfo);

      await generatePDF(photos, pdfOptions, jobInfo);

      console.log("=== PDF GENERATION COMPLETED ===");

      setError("PDF generated successfully!");
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      console.error("=== PDF GENERATION FAILED ===", err);
      handleError(
        "Failed to generate PDF. Please check the console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearPhotos = () => {
    setPhotos([]);
    setCurrentJob(null);
    setJobNumber("");
    setEditingPhotoId(null);
    setEditingName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
    if (editingPhotoId === photoId) {
      setEditingPhotoId(null);
      setEditingName("");
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                Photo Grid Report Builder
              </h1>
              <p className="text-gray-600 mt-2">
                Generate professional photo reports from SimPRO jobs or uploaded
                images
              </p>
            </div>

            <div className="flex gap-3">
              {photos.length > 0 && (
                <>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={downloadPDF}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {loading
                      ? "Generating..."
                      : `Download PDF (${getPageCount()} page${
                          getPageCount() > 1 ? "s" : ""
                        })`}
                  </button>
                  <button
                    onClick={clearPhotos}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div
            className={`border rounded-lg p-4 flex items-center gap-3 ${
              error.includes("successfully")
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            {error.includes("successfully") ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span
              className={
                error.includes("successfully")
                  ? "text-green-800"
                  : "text-red-800"
              }
            >
              {error}
            </span>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h3 className="text-lg font-semibold mb-4">
              PDF Generation Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos per Page
                </label>
                <select
                  value={pdfOptions.photosPerPage}
                  onChange={(e) =>
                    setPdfOptions((prev) => ({
                      ...prev,
                      photosPerPage: Number(e.target.value),
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value={4}>4 Photos</option>
                  <option value={6}>6 Photos</option>
                  <option value={8}>8 Photos</option>
                  <option value={12}>12 Photos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grid Columns
                </label>
                <select
                  value={pdfOptions.gridCols}
                  onChange={(e) =>
                    setPdfOptions((prev) => ({
                      ...prev,
                      gridCols: Number(e.target.value) as 2 | 3 | 4 | 6,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value={2}>2 Columns</option>
                  <option value={3}>3 Columns</option>
                  <option value={4}>4 Columns</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <select
                  value={pdfOptions.fontSize}
                  onChange={(e) =>
                    setPdfOptions((prev) => ({
                      ...prev,
                      fontSize: e.target.value as "small" | "medium" | "large",
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="includeFilenames"
                checked={pdfOptions.includeFilenames}
                onChange={(e) =>
                  setPdfOptions((prev) => ({
                    ...prev,
                    includeFilenames: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              <label
                htmlFor="includeFilenames"
                className="text-sm text-gray-700"
              >
                Include filenames
              </label>
            </div>
          </div>
        </div>
      )}

      {photos.length === 0 && (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="text-center mb-6">
              <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Import from SimPRO
              </h3>
              <p className="text-gray-600">
                Enter a job number to automatically import photo attachments
              </p>
            </div>

            <div className="flex gap-4 max-w-md mx-auto">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Job Number"
                  value={jobNumber}
                  onChange={(e) => setJobNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center font-medium"
                  onKeyPress={(e) =>
                    e.key === "Enter" && fetchSimproAttachments()
                  }
                />
              </div>
              <button
                onClick={fetchSimproAttachments}
                disabled={loading || !jobNumber.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                {loading ? "Loading..." : "Import"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Or Upload Photos Manually
              </h3>
              <p className="text-gray-600 mb-6">
                Select multiple image files at once. Supports JPG, PNG, and
                other formats.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? "Loading..." : "Choose Files"}
              </button>
            </div>
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">{photos.length} Photos</span>
                </div>
                {currentJob && (
                  <div className="text-sm text-gray-600">
                    Job:{" "}
                    <span className="font-medium">
                      {currentJob.Name || jobNumber}
                    </span>
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  Total size:{" "}
                  {formatFileSize(
                    photos.reduce((acc, photo) => acc + photo.size, 0)
                  )}
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  {getPageCount()} page{getPageCount() > 1 ? "s" : ""} •{" "}
                  {pdfOptions.photosPerPage} photos per page
                </div>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Add More Photos
              </button>
            </div>
          </div>

          <div ref={printRef} className="bg-white rounded-lg shadow-sm p-6">
            <div
              className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${pdfOptions.gridCols} gap-6`}
            >
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-gray-50 rounded-lg overflow-hidden relative group"
                >
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="aspect-square bg-white p-2">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="p-3">
                    {editingPhotoId === photo.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-full text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") savePhotoName(photo.id);
                            if (e.key === "Escape") cancelEditingName();
                          }}
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => savePhotoName(photo.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditingName}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p
                          className="text-sm font-medium text-gray-900 break-words leading-tight flex-1 cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => startEditingName(photo.id, photo.name)}
                          title="Click to edit filename"
                        >
                          {removeExtension(photo.name)}
                        </p>
                        <Edit3
                          className="w-3 h-3 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                          onClick={() => startEditingName(photo.id, photo.name)}
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          photo.source === "simpro"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {photo.source === "simpro" ? "SimPRO" : "Uploaded"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(photo.size)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default PhotoGridApp;
