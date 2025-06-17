"use client";

import Link from "next/link";
import { FileText, Plus, Calendar, Users } from "lucide-react";
import styles from "./QuickActions.module.css";

export default function QuickActions() {
  const actions = [
    {
      title: "Generate Report",
      description: "Create photo reports and analytics",
      icon: FileText,
      color: "blue",
      href: "/reports",
    },
    {
      title: "Add Customer",
      description: "Register new customer account",
      icon: Plus,
      color: "green",
      href: "/customers/new",
    },
    {
      title: "Schedule Meeting",
      description: "Book appointment or meeting",
      icon: Calendar,
      color: "purple",
      href: "/calendar/new",
    },
    {
      title: "View Customers",
      description: "Manage customer database",
      icon: Users,
      color: "orange",
      href: "/customers",
    },
  ];

  return (
    <div className={styles.actionsCard}>
      <h3 className={styles.cardTitle}>Quick Actions</h3>

      <div className={styles.actionsList}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              href={action.href}
              className={`${styles.actionItem} ${styles[action.color]}`}
            >
              <div className={styles.actionIcon}>
                <Icon size={20} />
              </div>
              <div className={styles.actionContent}>
                <h4 className={styles.actionTitle}>{action.title}</h4>
                <p className={styles.actionDescription}>{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
