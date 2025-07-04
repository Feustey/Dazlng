import { ReactNode } from "react";
import AdminAuthGuard from "./components/AdminAuthGuard";
import Layout from "./components/layout/Layout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthGuard>
      <Layout>{children}</Layout>
    </AdminAuthGuard>
  );
}

export const dynamic = "force-dynamic";
