// types/index.ts
export interface PhotoGridItem {
  id: string;
  name: string;
  url: string;
  size: number;
  source: "upload" | "simpro";
  simproData?: any;
}

export interface PhotoGridOptions {
  photosPerPage: number;
  includeFilenames: boolean;
  fontSize: "small" | "medium" | "large";
  gridCols: 2 | 3 | 4 | 6;
  paperSize: "A4" | "Letter";
  orientation: "portrait" | "landscape";
}

export interface JobInfo {
  name?: string;
  number?: string;
}

export interface SimproJob {
  ID: string;
  Name: string;
  // Add other SimPRO job properties as needed
}

export interface SimproAttachment {
  ID: string;
  Filename: string;
  MimeType: string;
  Base64Data: string;
  FileSizeBytes: number;
}
