import Layout from "./components/layout/Layout";
import React, { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }): React.ReactElement {
  return <Layout>{children}</Layout>;
} 