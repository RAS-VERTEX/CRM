// utils/helpers.ts

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Remove file extension from filename
 */
export function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}

/**
 * Generate a unique ID for uploaded photos
 */
export function generatePhotoId(): string {
  return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Validate file size (default 10MB limit)
 */
export function isValidFileSize(file: File, maxSizeInMB: number = 10): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Convert file to base64 data URL
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => {
      reject(new Error(`Failed to read ${file.name}`));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Generate filename for PDF export
 */
export function generatePDFFilename(
  photoCount: number,
  pageCount: number,
  jobNumber?: string
): string {
  const timestamp = new Date().toISOString().split("T")[0];
  const jobPart = jobNumber ? `job-${jobNumber}-` : "";
  return `${jobPart}photos-${photoCount}items-${pageCount}pages-${timestamp}.pdf`;
}

/**
 * Calculate number of pages based on photos and photos per page
 */
export function calculatePageCount(
  photoCount: number,
  photosPerPage: number
): number {
  return Math.ceil(photoCount / photosPerPage);
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Deep clone an object (for state updates)
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if browser supports required features
 */
export function checkBrowserSupport(): {
  fileReader: boolean;
  canvas: boolean;
  download: boolean;
} {
  return {
    fileReader: typeof FileReader !== "undefined",
    canvas: typeof HTMLCanvasElement !== "undefined",
    download: typeof document.createElement("a").download !== "undefined",
  };
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Throttle function for scroll/resize events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
