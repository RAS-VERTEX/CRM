"use client";

import React, { useRef } from "react";
import {
  Upload,
  Download,
  Trash2,
  Plus,
  FileText,
  ArrowUp,
  ArrowDown,
  Move,
} from "lucide-react";
import { UsePDFEditorReturn, PDFPageInfo } from "@/hooks/usePDFEditor";

interface PDFEditorProps {
  initialPhotos?: Array<{ url: string; name: string }>;
  onClose?: () => void;
  pdfEditor: UsePDFEditorReturn;
}

const PDFEditor = ({ initialPhotos, onClose, pdfEditor }: PDFEditorProps) => {
  const {
    loadedPDFs,
    combinedPages,
    loading,
    error,
    loadPDF,
    addPageToCombined,
    removePageFromCombined,
    movePageInCombined,
    exportCombinedPDF,
    clearAll,
    generatePhotoPDF,
  } = pdfEditor;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.type === "application/pdf") {
        loadPDF(file, "uploaded");
      }
    });
  };

  const handleAddPhotos = async () => {
    if (initialPhotos && initialPhotos.length > 0) {
      await generatePhotoPDF(initialPhotos);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Load PDFs</h3>

        <div className="flex gap-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload PDFs
          </button>

          {initialPhotos && initialPhotos.length > 0 && (
            <button
              onClick={handleAddPhotos}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Photos PDF
            </button>
          )}

          <button
            onClick={clearAll}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source PDFs */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Source Documents</h3>

          {loadedPDFs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No PDFs loaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {loadedPDFs.map((pdf) => (
                <div key={pdf.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {pdf.name}
                    <span className="text-sm text-gray-500">
                      ({pdf.pages.length} pages)
                    </span>
                  </h4>

                  <div className="grid grid-cols-4 gap-2">
                    {pdf.pages.map((page) => (
                      <div
                        key={page.id}
                        className="relative group cursor-pointer border rounded-lg p-2 hover:border-blue-300 transition-colors"
                      >
                        <div className="aspect-[3/4] bg-gray-100 rounded mb-1 flex items-center justify-center">
                          <div className="text-xs text-gray-500 text-center">
                            <FileText className="w-6 h-6 mx-auto mb-1" />
                            Page {page.pageNumber}
                          </div>
                        </div>

                        <button
                          onClick={() => addPageToCombined(page)}
                          className="absolute top-1 right-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>

                        <p className="text-xs text-center truncate">
                          {page.pageNumber}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Combined Document */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Combined Document ({combinedPages.length} pages)
            </h3>

            {combinedPages.length > 0 && (
              <button
                onClick={exportCombinedPDF}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {loading ? "Exporting..." : "Export PDF"}
              </button>
            )}
          </div>

          <div className="min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg p-4">
            {combinedPages.length === 0 ? (
              <div className="text-center text-gray-500 py-16">
                <Move className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Build Your Document</p>
                <p>
                  Click the + button on pages from the left to add them here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {combinedPages.map((page, index) => (
                  <div
                    key={page.id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-12 bg-white border rounded flex items-center justify-center text-xs flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {page.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Position {index + 1} of {combinedPages.length}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => movePageInCombined(page.id, "up")}
                        disabled={index === 0}
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center justify-center"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => movePageInCombined(page.id, "down")}
                        disabled={index === combinedPages.length - 1}
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center justify-center"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => removePageFromCombined(page.id)}
                        className="w-8 h-8 bg-red-200 hover:bg-red-300 rounded flex items-center justify-center"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFEditor;
