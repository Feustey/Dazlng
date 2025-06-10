import Layout from "./components/layout/Layout";
import { ReactNode } from "react";
import AdminAuthGuard from "./components/AdminAuthGuard";

export default function AdminLayout({ children }: { children: ReactNode }): React.ReactElement {
  return (
    <AdminAuthGuard>
      <Layout>{children}</Layout>
    </AdminAuthGuard>
  );
} 