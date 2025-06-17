export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeCustomers: number;
  reportsGenerated: number;
  revenue: string;
}

export interface PhotoItem {
  id: string;
  name: string;
  url: string;
  timestamp: string;
  size?: number;
}

export interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "photo" | "analytics" | "financial";
}

export interface Activity {
  id: number;
  message: string;
  type: "report" | "customer" | "project";
  timestamp?: string;
}
