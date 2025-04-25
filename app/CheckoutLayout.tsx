"use client";

import { useParams } from "next/navigation";
import { ReactNode } from "react";
import ProgressBar from "./ProgressBar";
import DazIAProgressBar from "../daz-ia/ProgressBar";
import { motion } from "framer-motion";

interface CheckoutLayoutProps {
  children: ReactNode;
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  const params = useParams();
  const isDazIA = params?.productType === "daz-ia";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-background to-background/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          {isDazIA ? <DazIAProgressBar /> : <ProgressBar />}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-card/50 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 p-8"
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}
