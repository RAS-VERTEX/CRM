export function validateJobId(jobId: number): void {
  if (!Number.isInteger(jobId) || jobId <= 0) {
    throw new Error("Invalid job ID. Must be a positive integer.");
  }
}

export function validateCompanyId(companyId: number): void {
  if (!Number.isInteger(companyId) || companyId < 0) {
    throw new Error("Invalid company ID. Must be a non-negative integer.");
  }
}

export function validateFileId(fileId: string): void {
  if (!fileId || typeof fileId !== "string" || fileId.trim().length === 0) {
    throw new Error("Invalid file ID. Must be a non-empty string.");
  }
}

export function validateImageFile(file: File): void {
  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name} is not a valid image file`);
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error(`${file.name} is too large. Maximum size is 10MB`);
  }
}

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}
