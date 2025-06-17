"use client";

import Link from "next/link";
import {
  Camera,
  DollarSign,
  Users,
  Folder,
  TrendingUp,
  Package,
} from "lucide-react";
import { ReportType } from "@/types";
import styles from "./ReportSelector.module.css";

interface ReportSelectorProps {
  reportTypes: ReportType[];
}

const iconMap = {
  camera: Camera,
  "dollar-sign": DollarSign,
  users: Users,
  folder: Folder,
  "trending-up": TrendingUp,
  package: Package,
};

export default function ReportSelector({ reportTypes }: ReportSelectorProps) {
  const getReportHref = (reportId: string) => {
    switch (reportId) {
      case "photo-report":
        return "/reports/photo-report";
      default:
        return `/reports/${reportId}`;
    }
  };

  const getCategoryColor = (category: ReportType["category"]) => {
    switch (category) {
      case "photo":
        return "blue";
      case "financial":
        return "green";
      case "analytics":
        return "purple";
      default:
        return "gray";
    }
  };

  const groupedReports = reportTypes.reduce((acc, report) => {
    if (!acc[report.category]) {
      acc[report.category] = [];
    }
    acc[report.category].push(report);
    return acc;
  }, {} as Record<string, ReportType[]>);

  const categoryTitles = {
    photo: "Photo & Media Reports",
    financial: "Financial Reports",
    analytics: "Analytics & Insights",
  };

  return (
    <div className={styles.reportSelector}>
      {Object.entries(groupedReports).map(([category, reports]) => (
        <div key={category} className={styles.categorySection}>
          <h3 className={styles.categoryTitle}>
            {categoryTitles[category as keyof typeof categoryTitles]}
          </h3>

          <div className={styles.reportsGrid}>
            {reports.map((report) => {
              const Icon =
                iconMap[report.icon as keyof typeof iconMap] || Camera;
              const colorClass = getCategoryColor(report.category);

              return (
                <Link
                  key={report.id}
                  href={getReportHref(report.id)}
                  className={`${styles.reportCard} ${styles[colorClass]}`}
                >
                  <div className={styles.reportIcon}>
                    <Icon size={24} />
                  </div>

                  <div className={styles.reportContent}>
                    <h4 className={styles.reportTitle}>{report.name}</h4>
                    <p className={styles.reportDescription}>
                      {report.description}
                    </p>
                  </div>

                  <div className={styles.reportArrow}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
