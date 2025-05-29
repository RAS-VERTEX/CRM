interface SimproConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  // or API key depending on your auth method
}

export class SimproClient {
  private config: SimproConfig;
  private accessToken?: string;

  constructor(config: SimproConfig) {
    this.config = config;
  }

  async authenticate() {
    // Handle OAuth2 or API key authentication
  }

  async getJobsForDate(date: string) {
    // Fetch scheduled jobs for a specific date
  }

  async getSiteDetails(siteId: string) {
    // Get site address and location data
  }

  async getTechnicians() {
    // Get list of technicians/teams
  }
}
