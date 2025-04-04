"use client";

import * as React from "react";

import Link from "next/link";
import { useState } from "react";

import { Footer } from "@components/Footer";
import Header from "@components/Header";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
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

export default ClientLayout;
