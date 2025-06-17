"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Download,
  Building2,
  Search,
  X,
  AlertCircle,
  FileText,
} from "lucide-react";
import { usePDFEditor } from "@/lib/hooks/usePDFEditor";
import PDFEditor from "@/components/PDFEditor";

interface Photo {
  id: string;
  name: string;
  url: string;
  size: number;
}

const PhotoGridApp = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobNumber, setJobNumber] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [showPDFEditor, setShowPDFEditor] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfEditor = usePDFEditor();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto: Photo = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            url: e.target?.result as string,
            size: file.size,
          };
          setPhotos((prev) => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const fetchSimproPhotos = async () => {
    if (!jobNumber.trim()) {
      setError("Please enter a job number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/simpro/jobs/${jobNumber}/attachments?companyId=0`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch photos from SimPRO");
      }

      const { attachments } = await response.json();

      if (!attachments || attachments.length === 0) {
        setError(`No photos found for job ${jobNumber}`);
        return;
      }

      const simproPhotos: Photo[] = attachments.map((att: any) => ({
        id: `simpro_${att.ID}`,
        name: att.Filename,
        url: `data:${att.MimeType};base64,${att.Base64Data}`,
        size: att.FileSizeBytes || 0,
      }));

      setPhotos((prev) => [...prev, ...simproPhotos]);
      setError(`Loaded ${simproPhotos.length} photos from SimPRO`);
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch photos");
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName.replace(/\.[^/.]+$/, ""));
  };

  const saveEdit = (id: string) => {
    if (editingName.trim()) {
      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === id
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
    setEditingId(null);
    setEditingName("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const clearAll = () => {
    setPhotos([]);
    setJobNumber("");
    setEditingId(null);
    setEditingName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
            ${photos
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

  const generateReport = async (
    mode: "print-only" | "pdf-editor" = "print-only"
  ) => {
    if (mode === "print-only") {
      generatePrint();
    } else {
      // Convert photos to the format expected by generatePhotoPDF
      const photoData = photos.map((photo) => ({
        url: photo.url,
        name: photo.name,
      }));

      await pdfEditor.generatePhotoPDF(photoData);
      setShowPDFEditor(true);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                Photo Report Builder
              </h1>
              <p className="text-gray-600 mt-2">
                Import photos from SimPRO or upload manually
              </p>
            </div>

            {photos.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={() => generateReport("print-only")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Quick Print
                </button>

                <button
                  onClick={() => generateReport("pdf-editor")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  PDF Editor
                </button>

                <button
                  onClick={clearAll}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Error Message */}
        {error && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              error.includes("Loaded")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* SimPRO Import */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Import from SimPRO</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter job number..."
              value={jobNumber}
              onChange={(e) => setJobNumber(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
              onKeyPress={(e) => e.key === "Enter" && fetchSimproPhotos()}
            />
            <button
              onClick={fetchSimproPhotos}
              disabled={loading || !jobNumber.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? "Loading..." : "Fetch Photos"}
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Upload Photos</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Drop images here or click to browse
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
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
            >
              Choose Files
            </button>
          </div>
        </div>

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Photos ({photos.length})
              </h3>
              <p className="text-sm text-gray-500">Click photo names to edit</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {editingId === photo.id ? (
                    <div className="bg-gray-100 rounded-lg px-3 py-2 mt-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full text-xs text-gray-700 text-center bg-transparent border-none outline-none"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") saveEdit(photo.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        onBlur={() => saveEdit(photo.id)}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div
                      className="bg-gray-100 rounded-lg px-3 py-2 mt-2 cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => startEditing(photo.id, photo.name)}
                    >
                      <p className="text-xs text-gray-700 text-center truncate">
                        {photo.name.replace(/\.[^/.]+$/, "")}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {photos.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Photos Yet
            </h3>
            <p className="text-gray-600">
              Import photos from a SimPRO job or upload files to get started
            </p>
          </div>
        )}
      </div>

      {/* PDF Editor Modal */}
      {showPDFEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">PDF Editor</h2>
              <button
                onClick={() => setShowPDFEditor(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <PDFEditor
                initialPhotos={photos.map((p) => ({
                  url: p.url,
                  name: p.name,
                }))}
                onClose={() => setShowPDFEditor(false)}
                pdfEditor={pdfEditor}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGridApp;
