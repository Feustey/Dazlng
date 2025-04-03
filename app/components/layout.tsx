"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@components/Footer";
import Header from "@components/Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
