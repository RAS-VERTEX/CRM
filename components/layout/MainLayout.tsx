import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "./MainLayout.module.css";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header title={title} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
