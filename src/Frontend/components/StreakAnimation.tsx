import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StreakAnimationProps {
  streak: number;
  isFirstTime?: boolean;
  onClose: () => void;
}

const StreakAnimation: React.FC<StreakAnimationProps> = ({
  streak,
  isFirstTime,
  onClose,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    const ANIMATION_DURATION = 5000;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onCloseRef.current(), 300);
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [streak, isFirstTime]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVisible(false);
        setTimeout(() => onCloseRef.current(), 300);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">

          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onCloseRef.current(), 300);
            }}
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,80,0,0.15) 0%, rgba(0,0,0,0.9) 60%)",
              backdropFilter: "blur(2px)",
            }}
          />

          {/* Contenedor principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 50 }}
            transition={{ type: "spring", damping: 16, stiffness: 200 }}
            className="relative"
            role="dialog"
            aria-modal="true"
            aria-label="Animación de racha"
          >
            <div className="w-72 rounded-3xl bg-gradient-to-b from-orange-500 via-red-500 to-purple-600 p-[2px] shadow-[0_0_40px_rgba(255,90,0,.25)]">
              <div className="relative rounded-3xl bg-gradient-to-b from-gray-900/95 to-black p-5 text-center">

                {/* Cinta nuevo récord */}
                {isFirstTime && (
                  <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-2"
                  >
                    <div className="rounded-md bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 text-sm font-black tracking-wide text-white shadow-lg">
                      ¡NUEVO RÉCORD! 🏆
                    </div>
                  </motion.div>
                )}

                {/* Mascota */}
                <div className="relative mx-auto h-64 w-64 flex items-center justify-center">
                  <FireCharacter />
                </div>

                {/* Número de racha */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    damping: 12,
                    stiffness: 220,
                    delay: 0.15,
                  }}
                  className="relative -mt-6"
                >
                  {/* Glow */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-7xl font-black tracking-tighter text-transparent blur-lg opacity-70"
                    initial={{ scale: 1, y: 0 }}
                    animate={{
                      scale: [1, 1.15, 1],
                      y: [0, -15, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      times: [0, 0.6, 1],
                      ease: "easeOut",
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    {streak}
                  </motion.span>

                  {/* Número principal */}
                  <motion.span
                    className="relative bg-gradient-to-r from-yellow-200 via-orange-400 to-red-500 bg-clip-text text-7xl font-black tracking-tighter text-transparent"
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{
                      scale: 1,
                      y: 0,
                      textShadow: [
                        "0 0 20px rgba(255,120,0,0.5)",
                        "0 0 40px rgba(255,100,0,0.8)",
                        "0 0 20px rgba(255,120,0,0.5)",
                      ],
                    }}
                    transition={{
                      scale: { duration: 0.4, ease: "easeOut" },
                      y: { duration: 0.4, ease: "easeOut" },
                      textShadow: {
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    {streak}
                  </motion.span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="-mt-1 text-xl font-bold"
                >
                  <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-400 bg-clip-text text-transparent">
                    {streak === 1 ? "¡día seguido!" : "¡días seguidos!"}
                  </span>
                </motion.div>

                {/* Corona de fuego */}
                {streak > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="mt-4 flex items-center justify-center gap-2"
                  >
                    <span className="text-sm font-bold text-orange-300">🔥</span>

                    {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-4 w-3 rounded-full"
                        style={{
                          background:
                            "linear-gradient(180deg, #FFE64D 0%, #FFB74D 30%, #FF7043 70%, #D32F2F 100%)",
                          boxShadow: "0 0 12px rgba(255,100,0,0.6)",
                        }}
                        animate={{
                          height: ["16px", "20px", "16px"],
                          opacity: [0.8, 1, 0.8],
                          filter: [
                            "drop-shadow(0 0 6px rgba(255,120,0,0.5))",
                            "drop-shadow(0 0 12px rgba(255,100,0,0.8))",
                            "drop-shadow(0 0 6px rgba(255,120,0,0.5))",
                          ],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut",
                        }}
                      />
                    ))}

                    <span className="text-sm font-bold text-orange-300">🔥</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StreakAnimation;

/* -----------------------------------------------------------
   🔥 PERSONAJE COMPLETO — FireCharacter
----------------------------------------------------------- */
const FireCharacter: React.FC = () => {
  return (
    <motion.svg
      viewBox="0 0 200 240"
      className="h-64 w-64"
      preserveAspectRatio="xMidYMid meet"
      animate={{
        y: [0, -6, 0],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <defs>
        <linearGradient id="flamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
          <stop offset="40%" style={{ stopColor: "#FFA500", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#FF6B35", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* CUERPO */}
      <path
        d="M 100 50 Q 80 30, 75 5 L 85 45 Q 70 35, 65 15 Q 50 50, 55 100 Q 60 140, 85 150 Q 100 155, 100 155 Q 100 155, 115 150 Q 140 140, 145 100 Q 150 50, 135 15 Q 130 35, 115 45 L 125 5 Q 120 30, 100 50 Z"
        fill="url(#flamGradient)"
        filter="drop-shadow(0 0 20px rgba(255, 100, 0, 0.6))"
      />

      {/* OJOS */}
      <circle cx="85" cy="85" r="8" fill="white" />
      <circle cx="115" cy="85" r="8" fill="white" />
      <circle cx="85" cy="87" r="5" fill="#1a1a1a" />
      <circle cx="115" cy="87" r="5" fill="#1a1a1a" />
      <circle cx="87" cy="85" r="2.5" fill="white" />
      <circle cx="117" cy="85" r="2.5" fill="white" />

      {/* BOCA */}
      <path
        d="M 80 110 Q 100 120, 120 110"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* CHISPAS */}
      <motion.circle
        cx={140}
        cy={40}
        r="3"
        fill="#FFD700"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.circle
        cx={60}
        cy={40}
        r="3"
        fill="#FFD700"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
      <motion.circle
        cx={155}
        cy={115}
        r="3"
        fill="#FFA500"
        animate={{ opacity: [0.3, 1, 0.3], x: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.circle
        cx={45}
        cy={115}
        r="3"
        fill="#FFA500"
        animate={{ opacity: [0.3, 1, 0.3], x: [0, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
    </motion.svg>
  );
};
