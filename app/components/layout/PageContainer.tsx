"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  fullWidth?: boolean;
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.2 },
};

export default function PageContainer({
  children,
  title,
  subtitle,
  className = "",
  fullWidth = false,
}: PageContainerProps) {
  return (
    <motion.div
      className="relative min-h-screen pt-[80px]"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      {/* Fond avec dégradé et effet de grain */}
      <div className="absolute inset-0 hero-gradient">
        <div className="absolute inset-0 opacity-50 mix-blend-soft-light">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
        </div>
      </div>

      {/* Cercles décoratifs avec parallaxe */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Contenu */}
      <div className="relative z-10">
        {(title || subtitle) && (
          <motion.div
            className="container mx-auto px-4 py-12 text-center"
            variants={slideUp}
          >
            {title && (
              <h1 className="heading-1 mb-6">
                <span className="text-gradient">{title}</span>
              </h1>
            )}
            {subtitle && (
              <p className="body-large text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          className={`${
            fullWidth ? "" : "container mx-auto px-4"
          } ${className}`}
          variants={slideUp}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}
