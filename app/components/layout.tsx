"use client";

import * as React from "react";

import Link from "next/link";
import { useState } from "react";

import { Footer } from "@components/Footer";
import Navigation from "@components/Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
