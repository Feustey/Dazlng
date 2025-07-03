import { motion } from 'framer-motion';
import { SparklesIcon } from '@/app/components/icons/SparklesIcon';

export const DaziaHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-6 shadow-lg"
    >
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <SparklesIcon className="h-8 w-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Dazia IA</h1>
        </div>
        <p className="mt-2 text-lg text-white/90">
          Votre assistant IA personnel pour optimiser votre nœud Lightning
        </p>
      </div>
      
      {/* Particules animées */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_: any, i: any) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/30"
            initial={{ 
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0
            }}
            animate={{
              y: [null, Math.random() * 100 + '%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
export const dynamic = "force-dynamic";
