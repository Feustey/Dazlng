import Sidebar from "./Sidebar";
import Header from "./Header";
import { ReactNode } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
