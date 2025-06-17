"use client";

import { Building2, Users, FileText, BarChart3 } from "lucide-react";
import { DashboardStats as DashboardStatsType } from "@/types";
import styles from "./DashboardStats.module.css";

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      label: "Total Projects",
      value: stats.totalProjects,
      icon: Building2,
      color: "blue",
    },
    {
      label: "Active Customers",
      value: stats.activeCustomers,
      icon: Users,
      color: "green",
    },
    {
      label: "Reports Generated",
      value: stats.reportsGenerated,
      icon: FileText,
      color: "purple",
    },
    {
      label: "Revenue",
      value: stats.revenue,
      icon: BarChart3,
      color: "orange",
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{item.label}</p>
                <p className={styles.statValue}>{item.value}</p>
              </div>
              <div className={`${styles.statIcon} ${styles[item.color]}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
