import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aide - DazNode",
  description: "Centre d'aide DazNode"
};

export default function HelpLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}

export const dynamic = "force-dynamic";
