"use client";

import { useState } from "react";
import { Bell, User } from "lucide-react";
import styles from "./Header.module.css";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{title}</h1>
        </div>

        <div className={styles.headerRight}>
          <button
            className={styles.iconButton}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
          </button>

          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              <User size={18} />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Admin User</span>
              <span className={styles.userRole}>Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
