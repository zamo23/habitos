// src/Frontend/components/StreakAnimation.tsx
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

  // Mantener onClose estable dentro del timeout
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    const ANIMATION_DURATION = 5000;
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Dar tiempo para la animación de salida
      setTimeout(() => onCloseRef.current(), 300);
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [streak, isFirstTime]); // onClose no es necesario aquí gracias a la ref

  // Cerrar con tecla ESC
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
            <div className="w-80 rounded-3xl bg-gradient-to-b from-orange-500 via-red-500 to-purple-600 p-[2px] shadow-[0_0_40px_rgba(255,90,0,.25)]">
              <div className="relative rounded-3xl bg-gradient-to-b from-gray-900/95 to-black p-6 text-center">
                {/* Cinta de nuevo récord */}
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

                {/* Mascota: Llama de fuego */}
                <div className="relative mx-auto h-52 w-52">
                  {/* Halo de brillo */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      filter: "blur(18px)",
                      background:
                        "radial-gradient(circle at 50% 55%, rgba(255,160,64,.5) 0%, rgba(255,80,0,.25) 30%, rgba(0,0,0,0) 60%)",
                      borderRadius: "9999px",
                    }}
                  />

                  {/* Llama SVG */}
                  <motion.svg
                    viewBox="0 0 220 220"
                    className="relative h-full w-full drop-shadow-[0_0_25px_rgba(255,120,0,.35)]"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [-0.8, 0.8, -0.8] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {/* ... tu SVG ... */}
                  </motion.svg>

                  {/* Chispas / partículas */}
                  {[...Array(12)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute h-1.5 w-1.5 rounded-full"
                      style={{
                        left: "50%",
                        top: "60%",
                        background:
                          "radial-gradient(circle, rgba(255,240,170,1) 0%, rgba(255,140,60,1) 60%, rgba(255,140,60,0) 70%)",
                        filter: "drop-shadow(0 0 8px rgba(255,160,80,.8))",
                      }}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0.8 }}
                      animate={{
                        x: (Math.cos(i * 30) * 70) / 2,
                        y: (Math.sin(i * 30) * -70) / 2 - 20,
                        opacity: [0, 1, 0],
                        scale: [0.8, 1.1, 0.6],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2 + (i % 4) * 0.25,
                        delay: i * 0.1,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>

                {/* Número de racha */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 220, delay: 0.15 }}
                  className="relative mt-1"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-6xl font-black tracking-tighter text-transparent blur-lg opacity-70"
                    initial={{ scale: 1, y: 0 }}
                    animate={{ 
                      scale: [1, 1.1, 1],
                      y: [0, -10, 0]
                    }}
                    transition={{ 
                      duration: 0.4,
                      times: [0, 0.6, 1],
                      ease: "easeOut"
                    }}
                  >
                    {streak}
                  </motion.span>
                  <motion.span
                    className="relative bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-6xl font-black tracking-tighter text-transparent"
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ 
                      scale: 1,
                      y: 0,
                      textShadow: [
                        "0 0 18px rgba(255,120,0,0.45)",
                        "0 0 32px rgba(255,120,0,0.75)",
                        "0 0 18px rgba(255,120,0,0.45)",
                      ],
                    }}
                    transition={{ 
                      scale: { duration: 0.4, ease: "easeOut" },
                      y: { duration: 0.4, ease: "easeOut" },
                      textShadow: { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    {streak}
                  </motion.span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-1 text-lg font-medium"
                >
                  <span className="bg-gradient-to-r from-orange-200 to-yellow-100 bg-clip-text text-transparent">
                    {streak === 1 ? "día seguido" : "días seguidos"}
                  </span>
                </motion.div>

                {/* Mini "corona" según racha (máx 7) */}
                {streak > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="mt-3 flex items-center justify-center gap-1"
                  >
                    {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="h-3 w-2 rounded-full"
                        style={{
                          background:
                            "linear-gradient(180deg, #FFD166 0%, #FF7A3D 60%, #E63946 100%)",
                        }}
                        animate={{
                          height: ["12px", "16px", "12px"],
                          opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          delay: i * 0.08,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
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
