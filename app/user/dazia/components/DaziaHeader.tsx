import { motion } from "framer-motion";
import { SparklesIcon } from "@/app/components/icons/SparklesIcon";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export const DaziaHeader = () => {
  const { t } = useAdvancedTranslation();
  
  return (
    <motion.div className="relative text-center mb-12">
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <SparklesIcon className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">{t("user.dazia_ia")}</h1>
        </div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Votre assistant IA personnel pour optimiser votre nœud Lightning
        </p>
      </div>
      
      {/* Particules animées */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export const dynamic = "force-dynamic";