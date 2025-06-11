import {
  Salesperson,
  Quote,
  Coordinates,
  GeocodeResult,
} from "../types/simpro";

const SIMPRO_BASE_URL = process.env.NEXT_PUBLIC_SIMPRO_BASE_URL;
const SIMPRO_ACCESS_TOKEN = process.env.SIMPRO_ACCESS_TOKEN;
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const COMPANY_ID = 0; // Default company ID, adjust if using multi-company

console.log("Environment check:", {
  SIMPRO_BASE_URL: SIMPRO_BASE_URL ? "✓ Set" : "✗ Missing",
  SIMPRO_ACCESS_TOKEN: SIMPRO_ACCESS_TOKEN ? "✓ Set" : "✗ Missing",
  MAPBOX_TOKEN: MAPBOX_TOKEN ? "✓ Set" : "✗ Missing",
});

if (!SIMPRO_BASE_URL || !SIMPRO_ACCESS_TOKEN) {
  throw new Error(
    "Missing required environment variables: SIMPRO_BASE_URL and SIMPRO_ACCESS_TOKEN"
  );
}

const headers = {
  Authorization: `Bearer ${SIMPRO_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response: ${errorText}`);
      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(
      `Received ${Array.isArray(data) ? data.length : "non-array"} items`
    );
    return data;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
}

/**
 * Fetch all employees from SimPRO
 */
export async function fetchEmployees(): Promise<Salesperson[]> {
  const url = `${SIMPRO_BASE_URL}/api/v1.0/companies/${COMPANY_ID}/employees/`;
  return apiRequest<Salesperson[]>(url);
}

/**
 * Fetch detailed employee information
 */
export async function fetchEmployeeDetails(
  employeeId: number
): Promise<Salesperson> {
  const url = `${SIMPRO_BASE_URL}/api/v1.0/companies/${COMPANY_ID}/employees/${employeeId}`;
  return apiRequest<Salesperson>(url);
}

/**
 * Fetch all salespeople (employees where IsSalesperson is true)
 */
export async function fetchSalespeople(): Promise<Salesperson[]> {
  try {
    console.log("Fetching all employees...");
    const employees = await fetchEmployees();
    console.log(`Found ${employees.length} total employees`);

    const salespeople: Salesperson[] = [];

    // Get detailed info for each employee to check UserProfile.IsSalesperson
    for (const employee of employees) {
      try {
        const detailedEmployee = await fetchEmployeeDetails(employee.ID);
        console.log(
          `Employee ${employee.Name} - IsSalesperson: ${detailedEmployee.UserProfile?.IsSalesperson}`
        );

        if (detailedEmployee.UserProfile?.IsSalesperson) {
          salespeople.push(detailedEmployee);
        }
      } catch (error) {
        console.warn(
          `Failed to fetch details for employee ${employee.ID}:`,
          error
        );
        // Continue with next employee
      }
    }

    console.log(`Found ${salespeople.length} salespeople`);
    return salespeople;
  } catch (error) {
    console.error("Error fetching salespeople:", error);
    throw new Error("Failed to fetch salespeople");
  }
}

/**
 * Fetch all quotes from SimPRO
 */
export async function fetchQuotes(): Promise<Quote[]> {
  const url = `${SIMPRO_BASE_URL}/api/v1.0/companies/${COMPANY_ID}/quotes/`;
  return apiRequest<Quote[]>(url);
}

/**
 * Fetch detailed quote information including status
 */
export async function fetchQuoteDetails(quoteId: number): Promise<Quote> {
  const url = `${SIMPRO_BASE_URL}/api/v1.0/companies/${COMPANY_ID}/quotes/${quoteId}`;
  return apiRequest<Quote>(url);
}

/**
 * Fetch quotes for a specific salesperson - MORE FLEXIBLE FILTERING
 */
export async function fetchQuotesForSalesperson(
  salespersonId: number
): Promise<Quote[]> {
  try {
    console.log(`Fetching quotes for salesperson ${salespersonId}...`);

    // First get all quotes
    const allQuotes = await fetchQuotes();
    console.log(`Found ${allQuotes.length} total quotes in system`);

    const salespersonQuotes: Quote[] = [];
    let quotesChecked = 0;
    let quotesForSalesperson = 0;
    let quotesWithRightStatus = 0;

    // Filter quotes for this salesperson and get detailed info
    for (const quote of allQuotes) {
      try {
        quotesChecked++;
        const detailedQuote = await fetchQuoteDetails(quote.ID);

        console.log(
          `Quote ${quote.ID} - Salesperson: ${detailedQuote.Salesperson?.ID}, Status: ${detailedQuote.Status?.Name}, Stage: ${detailedQuote.Stage}`
        );

        // Check if quote is assigned to this salesperson
        if (detailedQuote.Salesperson?.ID === salespersonId) {
          quotesForSalesperson++;

          // MORE FLEXIBLE STATUS FILTERING - let's include more quotes initially
          const statusName = detailedQuote.Status?.Name?.toLowerCase() || "";
          const stage = detailedQuote.Stage || "";

          const isValidQuote =
            // Original conditions
            statusName.includes("to write") ||
            statusName.includes("pending") ||
            statusName.includes("draft") ||
            statusName.includes("in progress") ||
            stage === "InProgress" ||
            // Additional conditions - let's be more inclusive
            statusName.includes("open") ||
            statusName.includes("active") ||
            stage === "Complete" ||
            // If no specific status, include it anyway for now
            !detailedQuote.Status?.Name;

          console.log(
            `Quote ${quote.ID} status check - Valid: ${isValidQuote}`
          );

          if (isValidQuote) {
            quotesWithRightStatus++;
            salespersonQuotes.push(detailedQuote);
          }
        }

        // Log progress every 10 quotes
        if (quotesChecked % 10 === 0) {
          console.log(
            `Progress: ${quotesChecked}/${allQuotes.length} quotes checked`
          );
        }
      } catch (error) {
        console.warn(`Failed to fetch details for quote ${quote.ID}:`, error);
        // Continue with next quote
      }
    }

    console.log(`Summary for salesperson ${salespersonId}:`);
    console.log(`- Total quotes checked: ${quotesChecked}`);
    console.log(`- Quotes assigned to salesperson: ${quotesForSalesperson}`);
    console.log(`- Quotes with valid status: ${quotesWithRightStatus}`);
    console.log(`- Final quotes returned: ${salespersonQuotes.length}`);

    return salespersonQuotes;
  } catch (error) {
    console.error(
      `Error fetching quotes for salesperson ${salespersonId}:`,
      error
    );
    throw new Error(`Failed to fetch quotes for salesperson ${salespersonId}`);
  }
}

/**
 * Geocode an address using Mapbox Geocoding API
 */
export async function geocodeAddress(
  address: string
): Promise<Coordinates | null> {
  if (!MAPBOX_TOKEN) {
    console.warn("MAPBOX_TOKEN not configured, skipping geocoding");
    return null;
  }

  if (!address || address.trim() === "") {
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address.trim());
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}&limit=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { latitude, longitude };
    }

    return null;
  } catch (error) {
    console.error(`Error geocoding address "${address}":`, error);
    return null;
  }
}

/**
 * Enhanced fetch quotes with geocoding
 */
export async function fetchQuotesWithCoordinates(
  salespersonId: number
): Promise<Quote[]> {
  try {
    console.log(
      `Fetching quotes with coordinates for salesperson ${salespersonId}...`
    );
    const quotes = await fetchQuotesForSalesperson(salespersonId);

    console.log(`Geocoding ${quotes.length} quotes...`);

    // Add coordinates to each quote
    const quotesWithCoords = await Promise.all(
      quotes.map(async (quote, index) => {
        const siteAddress = quote.Site?.Name || "";
        console.log(
          `Geocoding quote ${index + 1}/${quotes.length}: "${siteAddress}"`
        );

        const coordinates = await geocodeAddress(siteAddress);

        return {
          ...quote,
          coordinates: coordinates
            ? ([coordinates.longitude, coordinates.latitude] as [
                number,
                number
              ])
            : undefined,
        };
      })
    );

    const quotesWithValidCoords = quotesWithCoords.filter((q) => q.coordinates);
    console.log(
      `${quotesWithValidCoords.length}/${quotes.length} quotes have valid coordinates`
    );

    return quotesWithCoords;
  } catch (error) {
    console.error("Error fetching quotes with coordinates:", error);
    throw error;
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

/**
 * Simple route optimization by due date and value
 */
export function optimizeQuotesByPriority(quotes: Quote[]): Quote[] {
  return [...quotes].sort((a, b) => {
    // First priority: due date (earlier dates first)
    const dateA = new Date(a.DueDate || "2099-12-31");
    const dateB = new Date(b.DueDate || "2099-12-31");

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }

    // Second priority: higher value quotes first
    const valueA = a.Total?.IncTax || 0;
    const valueB = b.Total?.IncTax || 0;
    return valueB - valueA;
  });
}

import {
  SimproConfig,
  SimproAttachment,
  SimproAuthResponse,
  ApiResponse,
} from "./types";
import { validateJobId, validateCompanyId } from "../utils/validation";
import { logger } from "../utils/logger";

export class SimproClient {
  private config: SimproConfig;
  private accessToken?: string;
  private tokenExpiry?: Date;

  constructor(config: SimproConfig) {
    this.config = config;
    this.validateConfig();
  }

  private validateConfig(): void {
    if (
      !this.config.baseUrl ||
      !this.config.clientId ||
      !this.config.clientSecret
    ) {
      throw new Error("SimPRO configuration is incomplete");
    }
  }

  async authenticate(): Promise<void> {
    try {
      const response = await fetch(`${this.config.baseUrl}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Authentication failed: ${response.status} ${response.statusText}`
        );
      }

      const data: SimproAuthResponse = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000);

      logger.info("SimPRO authentication successful");
    } catch (error) {
      logger.error("SimPRO authentication failed", error);
      throw new Error("Failed to authenticate with SimPRO");
    }
  }

  private async ensureAuthenticated(): Promise<void> {
    if (
      !this.accessToken ||
      !this.tokenExpiry ||
      this.tokenExpiry <= new Date()
    ) {
      await this.authenticate();
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    await this.ensureAuthenticated();

    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      logger.error(errorMessage, { endpoint, status: response.status });
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { data, status: response.status };
  }

  async getJobAttachments(
    companyId: number,
    jobId: number,
    options: {
      pageSize?: number;
      page?: number;
      columns?: string[];
    } = {}
  ): Promise<SimproAttachment[]> {
    validateCompanyId(companyId);
    validateJobId(jobId);

    const params = new URLSearchParams();
    if (options.pageSize)
      params.append("pageSize", options.pageSize.toString());
    if (options.page) params.append("page", options.page.toString());
    if (options.columns) params.append("columns", options.columns.join(","));

    const endpoint = `/api/v1.0/companies/${companyId}/jobs/${jobId}/attachments/files/?${params}`;

    try {
      const response = await this.makeRequest<SimproAttachment[]>(endpoint);
      logger.info(
        `Retrieved ${response.data.length} attachments for job ${jobId}`
      );
      return response.data;
    } catch (error) {
      logger.error(`Failed to get attachments for job ${jobId}`, error);
      throw new Error(
        `Failed to retrieve job attachments: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getJobAttachmentWithBase64(
    companyId: number,
    jobId: number,
    fileId: string
  ): Promise<SimproAttachment> {
    validateCompanyId(companyId);
    validateJobId(jobId);

    const endpoint = `/api/v1.0/companies/${companyId}/jobs/${jobId}/attachments/files/${fileId}?display=Base64`;

    try {
      const response = await this.makeRequest<SimproAttachment>(endpoint);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get attachment ${fileId} with Base64`, error);
      throw new Error(
        `Failed to retrieve attachment data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getJobsForDate(date: string): Promise<any[]> {
    const endpoint = `/api/v1.0/companies/0/jobs?date=${date}`;
    const response = await this.makeRequest<any[]>(endpoint);
    return response.data;
  }

  async getSiteDetails(siteId: string): Promise<any> {
    const endpoint = `/api/v1.0/companies/0/sites/${siteId}`;
    const response = await this.makeRequest<any>(endpoint);
    return response.data;
  }

  async getTechnicians(): Promise<any[]> {
    const endpoint = `/api/v1.0/companies/0/employees`;
    const response = await this.makeRequest<any[]>(endpoint);
    return response.data;
  }
}
