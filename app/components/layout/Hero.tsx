"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Card from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Hero() {
  const t = useTranslations("Home");
  const locale = useLocale();

  return (
    <section className="relative min-h-[90vh] flex items-center hero-gradient overflow-hidden">
      {/* Effet de grain amélioré */}
      <div className="absolute inset-0 opacity-50 mix-blend-soft-light">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
      </div>

      {/* Cercles décoratifs avec parallaxe */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <motion.h1 className="heading-1 mb-8" variants={fadeIn}>
            <span className="text-gradient">
              Gérez vos nœuds
              <br />
              Lightning Network en
              <br />
              toute simplicité
            </span>
          </motion.h1>

          <motion.p
            className="body-large text-gray-300 mb-12"
            variants={fadeIn}
          >
            Optimisez vos performances et votre rentabilité avec Daznode
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            variants={fadeIn}
          >
            <Link
              href={`/${locale}/daznode`}
              className={cn(
                buttonVariants({ variant: "gradient" }),
                "hover-lift hover-glow"
              )}
            >
              Obtenez votre Dazbox !{" "}
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </Link>
            <Link
              href={`/${locale}/learn`}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "hover-lift"
              )}
            >
              Apprentissage
            </Link>
          </motion.div>
        </motion.div>

        {/* Statistiques avec animation */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card
            translucent
            className="p-8 hover-lift hover-glow transition-all"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="heading-3 text-gradient mb-4">
                Nœuds
                <br />
                Totaux
              </h3>
              <p className="text-gray-300 text-2xl font-semibold">10,000+</p>
            </motion.div>
          </Card>

          <Card
            translucent
            className="p-8 hover-lift hover-glow transition-all"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="heading-3 text-gradient mb-4">
                Canaux
                <br />
                Totaux
              </h3>
              <p className="text-gray-300 text-2xl font-semibold">50,000+</p>
            </motion.div>
          </Card>

          <Card
            translucent
            className="p-8 hover-lift hover-glow transition-all"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="heading-3 text-gradient mb-4">
                Capacité
                <br />
                Totale
              </h3>
              <p className="text-gray-300 text-2xl font-semibold">1,000 BTC</p>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
