// Base types for SimPRO API responses

export interface Address {
  Address: string;
  City: string;
  State: string;
  PostalCode: string;
  Country: string;
}

export interface PrimaryContact {
  Email: string;
  SecondaryEmail?: string;
  WorkPhone?: string;
  Extension?: string;
  CellPhone?: string;
  Fax?: string;
  PreferredNotificationMethod?: string;
}

export interface EmergencyContact {
  Name: string;
  Relationship: string;
  WorkPhone?: string;
  CellPhone?: string;
  AltPhone?: string;
  Address?: string;
}

export interface AccountSetup {
  Username: string;
  IsMobility: boolean;
  SecurityGroup?: {
    ID: number;
    Name: string;
  };
}

export interface UserProfile {
  IsSalesperson: boolean;
  IsProjectManager: boolean;
  StorageDevice?: {
    ID: number;
    Name: string;
  };
  PreferredLanguage: string;
}

export interface DefaultZone {
  ID: number;
  Name: string;
}

export interface DefaultCompany {
  ID: number;
  Name: string;
}

export interface Banking {
  AccountName: string;
  RoutingNo: string;
  AccountNo: string;
}

export interface PayRates {
  PayRate: number;
  EmploymentCost: number;
  Overhead: number;
}

export interface Salesperson {
  ID: number;
  Name: string;
  Position?: string;
  Availability?: string[];
  Address?: Address;
  DateOfHire?: string;
  DateOfBirth?: string;
  PrimaryContact?: PrimaryContact;
  EmergencyContact?: EmergencyContact;
  AccountSetup?: AccountSetup;
  UserProfile?: UserProfile;
  DateCreated?: string;
  DateModified?: string;
  Archived?: boolean;
  AssignedCostCenters?: any[];
  Zones?: any[];
  DefaultZone?: DefaultZone;
  DefaultCompany?: DefaultCompany;
  CustomFields?: any[];
  MaskedSSN?: string;
  Banking?: Banking;
  PayRates?: PayRates;
}

export interface Customer {
  ID: number;
  CompanyName: string;
  GivenName: string;
  FamilyName: string;
}

export interface CustomerContact {
  ID: number;
  GivenName: string;
  FamilyName: string;
}

export interface Site {
  ID: number;
  Name: string;
}

export interface SiteContact {
  ID: number;
  GivenName: string;
  FamilyName: string;
}

export interface ConvertedFromLead {
  ID: number;
  LeadName: string;
  DateCreated: string;
}

export interface SalespersonRef {
  ID: number;
  Name: string;
  Type: string;
  TypeId: number;
}

export interface ProjectManager {
  ID: number;
  Name: string;
  Type: string;
  TypeId: number;
}

export interface Technician {
  ID: number;
  Name: string;
  Type: string;
  TypeId: number;
}

export interface ArchiveReason {
  ID: number;
  ArchiveReason: string;
}

export interface Forecast {
  Year: number;
  Month: number;
  Percent: number;
}

export interface Total {
  ExTax: number;
  Tax: number;
  IncTax: number;
}

export interface Totals {
  MaterialsCost: any;
  ResourcesCost: any;
  MaterialsMarkup: any;
  ResourcesMarkup: any;
  Adjusted: any;
  MembershipDiscount: number;
  Discount: number;
  STCs: number;
  VEECs: number;
  GrossProfitLoss: any;
  GrossMargin: any;
  NettProfitLoss: any;
  NettMargin: any;
}

export interface Status {
  ID: number;
  Name: string;
  Color: string;
}

export interface STC {
  STCsEligible: boolean;
  VEECsEligible: boolean;
  STCValue: number;
  VEECValue: number;
}

export interface Quote {
  ID: number;
  Customer?: Customer;
  AdditionalCustomers?: any[];
  CustomerContact?: CustomerContact;
  AdditionalContacts?: any[];
  Site?: Site;
  SiteContact?: SiteContact;
  ConvertedFromLead?: ConvertedFromLead;
  Description?: string;
  Notes?: string;
  Type?: "Project" | "Service" | "Prepaid";
  Salesperson?: SalespersonRef;
  ProjectManager?: ProjectManager;
  Technicians?: any[];
  Technician?: Technician;
  DateIssued?: string;
  DateApproved?: string;
  DueDate?: string;
  ValidityDays?: number;
  OrderNo?: string;
  RequestNo?: string;
  Name?: string;
  IsClosed?: boolean;
  ArchiveReason?: ArchiveReason;
  Stage?: "InProgress" | "Complete" | "Approved";
  CustomerStage?: "New" | "Pending" | "Declined" | "Accepted";
  JobNo?: string;
  IsVariation?: boolean;
  LinkedJobID?: number;
  Forecast?: Forecast;
  Total?: Total;
  Totals?: Totals;
  Status?: Status;
  Tags?: any[];
  DateModified?: string;
  AutoAdjustStatus?: boolean;
  CustomFields?: any[];
  STC?: STC;
  // Added for route optimization
  coordinates?: [number, number]; // [longitude, latitude]
}

// UI State types
export interface RouteProgress {
  completed: number;
  total: number;
}

export type ViewMode = "map" | "list";

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Geocoding types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodeResult {
  address: string;
  coordinates: Coordinates | null;
}

// Route optimization types
export interface OptimizationOptions {
  strategy: "dueDate" | "value" | "distance" | "timeWindows";
  startLocation?: Coordinates;
  maxTravelTime?: number;
  preferHighValue?: boolean;
}

export interface OptimizedRoute {
  quotes: Quote[];
  totalDistance?: number;
  estimatedTime?: number;
  efficiency?: number;
}

export interface SimproConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  companyId?: number;
}

export interface SimproAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface SimproAttachment {
  ID: string;
  Filename: string;
  Folder?: {
    ID: number;
    Name: string;
  } | null;
  Public: boolean;
  Email: boolean;
  MimeType: string;
  FileSizeBytes: number;
  DateAdded: string;
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
