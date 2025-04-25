"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { WebLNProvider } from "@webbtc/webln-types";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { AlertCircle, Loader2, Wallet, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    webln?: WebLNProvider;
  }
}

// Composant de particules
const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }>
  >([]);
  const animationFrameRef = useRef<number>();
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajuster la taille du canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Définir la couleur des particules en fonction du thème
    const particleColor =
      theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";

    // Initialiser les particules
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };
    initParticles();

    // Animer les particules
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Mettre à jour la position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Rebondir sur les bords
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Dessiner la particule
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      aria-hidden="true"
    />
  );
};

export default function LoginPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;
  const [isLoading, setIsLoading] = useState(false);
  const [showAlbyInstall, setShowAlbyInstall] = useState(false);
  const [isCheckingAlby, setIsCheckingAlby] = useState(true);
  const { addToast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Éviter l'hydratation incorrecte
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkAlby = async () => {
      try {
        if (typeof window !== "undefined") {
          setShowAlbyInstall(!window.webln);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification d'Alby:", error);
        setShowAlbyInstall(true);
      } finally {
        setIsCheckingAlby(false);
      }
    };

    checkAlby();
  }, []);

  const handleAlbyLogin = async () => {
    try {
      setIsLoading(true);
      setShowAlbyInstall(false);

      // Vérifier si l'extension Alby est installée
      if (!window.webln) {
        setShowAlbyInstall(true);
        throw new Error(t("albyNonInstalle"));
      }

      // Demander l'autorisation à l'utilisateur
      await window.webln.enable();

      // Récupérer la pubkey
      const info = await window.webln.getInfo();
      const pubkey = info.node.pubkey;

      // Authentifier avec la pubkey
      const result = await signIn("credentials", {
        pubkey,
        redirect: false,
      });

      if (result?.error) {
        addToast({
          title: t("erreurConnexion"),
          description: result.error,
          type: "error",
        });
        return;
      }

      // Afficher l'animation de succès
      setShowSuccess(true);

      addToast({
        title: t("loginSuccess"),
        type: "success",
      });

      // Rediriger après un court délai
      setTimeout(() => {
        router.push(`/${locale}/dashboard`);
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      addToast({
        title: t("erreurConnexion"),
        description:
          error instanceof Error ? error.message : t("erreurAutorisation"),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionnaire pour la touche Entrée
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleAlbyLogin();
    }
  };

  // Basculer entre les thèmes clair et sombre
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (isCheckingAlby) {
    return (
      <div className="min-h-[600px] w-full max-w-md mx-auto p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <ParticlesBackground />
      <motion.div
        className="min-h-[600px] w-full max-w-md mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        role="main"
        aria-label={t("connexion")}
      >
        {/* Bouton de thème */}
        {mounted && (
          <motion.button
            onClick={toggleTheme}
            className="absolute top-4 right-4 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-accent/20 hover:bg-accent/10 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            aria-label={
              theme === "dark"
                ? "Passer au mode clair"
                : "Passer au mode sombre"
            }
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </motion.button>
        )}

        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-20 h-20 mb-4">
            <Image
              src="/logo.png"
              alt="DazNode Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-center gradient-text mb-2">
            DazNode
          </h1>
          <p className="text-center text-muted-foreground">
            {t("description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-card/80 backdrop-blur-lg border-accent/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center gradient-text">
                {t("connexion")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("connexionDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <AnimatePresence>
                  {showAlbyInstall && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      role="alert"
                      aria-live="polite"
                    >
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{t("albyNonInstalle")}</AlertTitle>
                        <AlertDescription>
                          <a
                            href="https://getalby.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                          >
                            {t("installerAlby")}
                          </a>
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    {t("connexionAlby")}
                  </h3>
                  <Button
                    onClick={handleAlbyLogin}
                    onKeyDown={handleKeyDown}
                    variant="gradient"
                    size="lg"
                    fullWidth
                    disabled={isLoading}
                    aria-label={
                      isLoading ? t("connexionEnCours") : t("connectWithAlby")
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("connexionEnCours")}
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        {t("connectWithAlby")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Animation de succès */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card p-8 rounded-lg shadow-lg text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 100 }}
                  className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold mb-2">{t("loginSuccess")}</h3>
                <p className="text-muted-foreground">{t("redirection")}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
