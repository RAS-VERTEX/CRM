// import MainLayout from "@/components/layout/MainLayout";
// import DashboardStats from "@/components/dashboard/DashboardStats";
// import RecentActivity from "@/components/dashboard/RecentActivity";
// import QuickActions from "@/components/dashboard/QuickActions";
// import { DashboardStats as DashboardStatsType, Activity } from "@/types";
// import styles from "./page.module.css";

// // This would typically come from your database
// async function getDashboardData(): Promise<{
//   stats: DashboardStatsType;
//   recentActivity: Activity[];
// }> {
//   // Simulate API call
//   return {
//     stats: {
//       totalProjects: 24,
//       activeCustomers: 156,
//       reportsGenerated: 89,
//       revenue: "$45.2K",
//     },
//     recentActivity: [
//       {
//         id: 1,
//         message: "Photo report generated for Job #2024-001",
//         type: "report",
//       },
//       {
//         id: 2,
//         message: 'New customer "ABC Construction" added',
//         type: "customer",
//       },
//       { id: 3, message: "Project milestone completed", type: "project" },
//     ],
//   };
// }

// export default async function Dashboard() {
//   const { stats, recentActivity } = await getDashboardData();

//   return (
//     <MainLayout title="Dashboard">
//       <div className={styles.dashboard}>
//         <DashboardStats stats={stats} />

//         <div className={styles.dashboardGrid}>
//           <RecentActivity activities={recentActivity} />
//           <QuickActions />
//         </div>
//       </div>
//     </MainLayout>
//   );
// }

// app/page.tsx or wherever you want it
// app/page.tsx
import SimproPDFForm from "@/components/SimProPDFForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Report Builder | SimPRO CRM",
  description: "Generate professional PDF reports from SimPRO jobs",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <SimproPDFForm jobNumber="" />
      </div>
    </div>
  );
}
