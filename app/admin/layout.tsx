import Layout from "./components/layout/Layout";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }): JSX.Element {
  return <Layout>{children}</Layout>;
} 