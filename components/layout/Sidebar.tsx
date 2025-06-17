"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const navigation = [
  { id: "dashboard", name: "Dashboard", href: "/", icon: LayoutDashboard },
  { id: "reports", name: "Reports", href: "/reports", icon: FileText },
  { id: "customers", name: "Customers", href: "/customers", icon: Users },
  { id: "calendar", name: "Calendar", href: "/calendar", icon: Calendar },
  { id: "analytics", name: "Analytics", href: "/analytics", icon: BarChart3 },
  { id: "settings", name: "Settings", href: "/settings", icon: Settings },
];

const RasVertexLogo = ({ collapsed }: { collapsed: boolean }) => (
  <div className={styles.logo}>
    <div className={styles.logoIcon}>
      <span>RV</span>
    </div>
    {!collapsed && <span className={styles.logoText}>RAS VERTEX</span>}
  </div>
);

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.logoContainer}>
        <RasVertexLogo collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={styles.collapseButton}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className={styles.navigation}>
        <ul>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${
                    isActive ? styles.active : ""
                  }`}
                >
                  <Icon size={20} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
