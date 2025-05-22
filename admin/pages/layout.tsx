import Layout from "../components/layout/Layout";
import { ReactNode } from "react";

export default function AdminRootLayout({ children }: { children: ReactNode }): JSX.Element {
  return <Layout>{children}</Layout>;
} 