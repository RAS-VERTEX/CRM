import MainLayout from "@/components/layout/MainLayout";
import PhotoReportGenerator from "@/components/reports/PhotoReport";

export default function PhotoReport() {
  return (
    <MainLayout title="Photo Report Generator">
      <PhotoReportGenerator />
    </MainLayout>
  );
}
