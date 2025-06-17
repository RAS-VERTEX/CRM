"use client";

import { Activity } from "@/types";
import styles from "./RecentActivity.module.css";

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "report":
        return "blue";
      case "customer":
        return "green";
      case "project":
        return "purple";
      default:
        return "gray";
    }
  };

  return (
    <div className={styles.activityCard}>
      <h3 className={styles.cardTitle}>Recent Activity</h3>

      <div className={styles.activityList}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.activityItem}>
            <div
              className={`${styles.activityDot} ${
                styles[getActivityColor(activity.type)]
              }`}
            ></div>
            <div className={styles.activityContent}>
              <span className={styles.activityMessage}>{activity.message}</span>
              {activity.timestamp && (
                <span className={styles.activityTime}>
                  {activity.timestamp}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.viewAllContainer}>
        <button className={styles.viewAllButton}>View All Activity</button>
      </div>
    </div>
  );
}
