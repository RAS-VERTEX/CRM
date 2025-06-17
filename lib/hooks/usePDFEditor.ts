import { useState, useCallback } from "react";

export interface PDFPageInfo {
  id: string;
  pdfId: string;
  pageNumber: number;
  thumbnail?: string;
  source: "main" | "photos" | "uploaded";
  title?: string;
  pdfBytes?: Uint8Array;
}

export interface LoadedPDFInfo {
  id: string;
  name: string;
  file: File;
  pages: PDFPageInfo[];
  source: "main" | "photos" | "uploaded";
}

export interface UsePDFEditorReturn {
  loadedPDFs: LoadedPDFInfo[];
  combinedPages: PDFPageInfo[];
  loading: boolean;
  error: string | null;

  loadPDF: (
    file: File,
    source?: "main" | "photos" | "uploaded"
  ) => Promise<void>;
  addPageToCombined: (page: PDFPageInfo) => void;
  removePageFromCombined: (pageId: string) => void;
  movePageInCombined: (pageId: string, direction: "up" | "down") => void;
  exportCombinedPDF: () => Promise<void>;
  clearAll: () => void;
  generatePhotoPDF: (
    photos: Array<{ url: string; name: string }>
  ) => Promise<void>;
}

export const usePDFEditor = (): UsePDFEditorReturn => {
  const [loadedPDFs, setLoadedPDFs] = useState<LoadedPDFInfo[]>([]);
  const [combinedPages, setCombinedPages] = useState<PDFPageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPDF = useCallback(
    async (file: File, source: "main" | "photos" | "uploaded" = "uploaded") => {
      setLoading(true);
      setError(null);

      try {
        // For now, create mock pages - in production you'd use pdf-lib to extract real pages
        const pdfId = Math.random().toString(36).substr(2, 9);

        // Simulate extracting pages from PDF
        const mockPageCount = Math.floor(Math.random() * 10) + 1; // 1-10 pages
        const pages: PDFPageInfo[] = [];

        for (let i = 0; i < mockPageCount; i++) {
          pages.push({
            id: `${pdfId}-page-${i}`,
            pdfId,
            pageNumber: i + 1,
            source,
            title: `${file.name} - Page ${i + 1}`,
            thumbnail: `/api/placeholder/150/200?text=Page${i + 1}`, // Mock thumbnail
          });
        }

        const pdfInfo: LoadedPDFInfo = {
          id: pdfId,
          name: file.name,
          file,
          pages,
          source,
        };

        setLoadedPDFs((prev) => [...prev, pdfInfo]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load PDF");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const addPageToCombined = useCallback((page: PDFPageInfo) => {
    setCombinedPages((prev) => [
      ...prev,
      {
        ...page,
        id: `combined-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      },
    ]);
  }, []);

  const removePageFromCombined = useCallback((pageId: string) => {
    setCombinedPages((prev) => prev.filter((p) => p.id !== pageId));
  }, []);

  const movePageInCombined = useCallback(
    (pageId: string, direction: "up" | "down") => {
      setCombinedPages((prev) => {
        const index = prev.findIndex((p) => p.id === pageId);
        if (index === -1) return prev;

        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= prev.length) return prev;

        const newPages = [...prev];
        [newPages[index], newPages[newIndex]] = [
          newPages[newIndex],
          newPages[index],
        ];
        return newPages;
      });
    },
    []
  );

  const exportCombinedPDF = useCallback(async () => {
    if (combinedPages.length === 0) {
      setError("No pages to export");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // For now, create a simple mock PDF
      // In production, you'd use pdf-lib to actually combine pages
      const mockPdfContent = `%PDF-1.4
Mock Combined PDF
Pages: ${combinedPages.map((p) => p.title).join(", ")}
Generated: ${new Date().toISOString()}`;

      const blob = new Blob([mockPdfContent], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `combined-document-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export PDF");
    } finally {
      setLoading(false);
    }
  }, [combinedPages]);

  const generatePhotoPDF = useCallback(
    async (photos: Array<{ url: string; name: string }>) => {
      setLoading(true);
      setError(null);

      try {
        // Create a mock photos PDF
        const pdfId = Math.random().toString(36).substr(2, 9);

        const photoPDF: LoadedPDFInfo = {
          id: pdfId,
          name: "Photos Report",
          file: new File([""], "photos.pdf", { type: "application/pdf" }),
          pages: [
            {
              id: `${pdfId}-photos`,
              pdfId,
              pageNumber: 1,
              source: "photos" as const,
              title: `Photos Report (${photos.length} photos)`,
              thumbnail: "/api/placeholder/150/200?text=Photos",
            },
          ],
          source: "photos",
        };

        setLoadedPDFs((prev) => [...prev, photoPDF]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate photos PDF"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearAll = useCallback(() => {
    setLoadedPDFs([]);
    setCombinedPages([]);
    setError(null);
  }, []);

  return {
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
  };
};
