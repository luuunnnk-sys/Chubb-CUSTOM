// src/components/SplashScreen.tsx
import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";

type SplashScreenProps = {
  onFinish: () => void;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 to-slate-300">
      {/* Blobs animés de fond */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-24 -top-16 w-80 h-80 md:w-96 md:h-96 bg-sky-200 rounded-full mix-blend-multiply blur-3xl opacity-30"
          animate={{ x: [0, 50, -50, 0], y: [0, 30, -30, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-10 bottom-10 w-64 h-64 md:w-80 md:h-80 bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-30"
          animate={{ x: [0, -40, 40, 0], y: [0, -20, 20, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        />
      </div>

      {/* Centre vertical + horizontal */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[90vw] flex-col items-center justify-center px-6">
        {/* Conteneur LOGO géant + bouton */}
        <div
          className="relative"
          style={{
            width: "min(600px, 90vw)",
            height: "min(600px, 90vw)",
          }}
        >
          {/* Logo légèrement remonté */}
          <motion.div
            className="absolute inset-0 flex items-start justify-center pt-6"
            initial={{ opacity: 0.0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="relative w-[92%] h-[92%]">
              <motion.img
                src="/icons/chubb-sketch.png"
                alt="Chubb Sketch"
                className="w-full h-full object-contain select-none"
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                draggable={false}
              />
              {/* Teinte bleue harmonisée */}
              <div className="pointer-events-none absolute inset-0 bg-sky-600/18 mix-blend-multiply rounded-[8%]" />
            </div>
          </motion.div>

          {/* Bouton en bas du logo, ancré au centre + micro-ajustement à droite via margin-left */}
          <motion.div
            className="absolute bottom-0 left-1/2 pb-6"
            style={{ transform: "translateX(-50%)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            {/* 👉 Ajuste ici : un chouïa à droite = augmente la marge (2 → 3 → 4 px) */}
            <div className="ml-[-24px] md:ml-[-24px]">
              <Button
                variant="primary"
                size="lg"
                onClick={onFinish}
                className="whitespace-nowrap"
                title="Commencer"
              >
                Bienvenue
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
