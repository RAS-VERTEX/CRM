import MainLayout from "@/components/layout/MainLayout";
import ReportSelector from "@/components/reports/ReportSelector";
import { ReportType } from "@/types";
import styles from "./page.module.css";

// This would come from your database or config
async function getReportTypes(): Promise<ReportType[]> {
  return [
    {
      id: "photo-report",
      name: "Photo Report",
      description:
        "Generate professional photo documentation reports with customizable layouts",
      icon: "camera",
      category: "photo",
    },
    {
      id: "financial-report",
      name: "Financial Report",
      description:
        "Comprehensive financial analysis and summaries with charts and metrics",
      icon: "dollar-sign",
      category: "financial",
    },
    {
      id: "customer-report",
      name: "Customer Report",
      description:
        "Customer activity and engagement reports with detailed analytics",
      icon: "users",
      category: "analytics",
    },
    {
      id: "project-report",
      name: "Project Report",
      description:
        "Project status and progress tracking reports with timeline views",
      icon: "folder",
      category: "analytics",
    },
    {
      id: "performance-report",
      name: "Performance Report",
      description: "Business performance metrics and KPI tracking dashboards",
      icon: "trending-up",
      category: "analytics",
    },
    {
      id: "inventory-report",
      name: "Inventory Report",
      description:
        "Stock levels, product movement and inventory analysis reports",
      icon: "package",
      category: "analytics",
    },
  ];
}

export default async function Reports() {
  const reportTypes = await getReportTypes();

  return (
    <MainLayout title="Reports">
      <div className={styles.reports}>
        <div className={styles.reportsHeader}>
          <h2>Report Generator</h2>
          <p>
            Choose from our comprehensive collection of report generators to
            create professional documentation and analytics.
          </p>
        </div>

        <ReportSelector reportTypes={reportTypes} />
      </div>
    </MainLayout>
  );
}
