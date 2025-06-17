export interface SimproAttachment {
  ID: string;
  Filename: string;
  Folder?: {
    ID: number;
    Name: string;
  } | null;
  Public?: boolean;
  Email?: boolean;
  MimeType?: string;
  FileSizeBytes?: number;
  DateAdded?: string;
  AddedBy?: {
    ID: number;
    Name: string;
    Type: string;
    TypeId: number;
  } | null;
  Base64Data?: string;
}

export interface SimproJob {
  ID: number;
  Name: string;
  Description?: string;
  Status: string;
  Customer?: {
    ID: number;
    Name: string;
  };
  Site?: {
    ID: number;
    Name: string;
    Address?: string;
  };
  DateCreated: string;
  DateScheduled?: string;
}

export interface PhotoGridItem {
  id: string;
  name: string;
  url: string;
  size: number;
  source: "upload" | "simpro";
  simproData?: SimproAttachment;
}

export interface PhotoGridOptions {
  photosPerPage: number;
  includeFilenames: boolean;
  includeHeader: boolean; // NEW: Control header visibility
  fontSize: "small" | "medium" | "large";
  gridCols: 2 | 3 | 4 | 6;
  paperSize: "A4" | "Letter";
  orientation: "portrait" | "landscape";
}

export interface PdfGenerationOptions extends PhotoGridOptions {
  title?: string;
  companyName?: string;
  jobNumber?: string;
  dateGenerated: string;
}

export interface JobAttachmentQuery {
  companyId: number;
  jobId: number;
  imageTypesOnly?: boolean;
  pageSize?: number;
  page?: number;
}

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export type LoadingState = "idle" | "loading" | "success" | "error";
