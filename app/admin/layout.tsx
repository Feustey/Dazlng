import React from 'react';
import Layout from "./components/layout/Layout";
import { ReactNode } from "react";
import AdminAuthGuard from "./components/AdminAuthGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthGuard>
      <Layout>{children}</Layout>
    </AdminAuthGuard>
  );
}
export const dynamic = "force-dynamic";
