import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessAnimationProps {
  isVisible: boolean;
  onReset?: () => void;
}

export function SuccessAnimation({ isVisible, onReset }: SuccessAnimationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
          aria-describedby="success-description"
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative text-center p-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Success circle */}
            <motion.div
              className="relative mx-auto w-24 h-24 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              />

              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/20"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Check icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
                </div>
              </motion.div>

              {/* Sparkles */}
              <motion.div
                className="absolute -top-2 -right-2"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1, 0], rotate: [0, 180, 360] }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Sparkles className="w-6 h-6 text-accent" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -left-2"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1, 0], rotate: [0, -180, -360] }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Sparkles className="w-5 h-5 text-secondary" />
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.h3
              id="success-title"
              className="text-2xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Message Sent!
            </motion.h3>
            <motion.p
              id="success-description"
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Thank you for reaching out. I'll get back to you soon.
            </motion.p>

            {/* Reset button */}
            {onReset && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button onClick={onReset} variant="outline" className="glass">
                  Send Another Message
                </Button>
              </motion.div>
            )}

            {/* Confetti-like particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: `hsl(var(--${["primary", "accent", "secondary"][i % 3]}))`,
                  left: "50%",
                  top: "50%",
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, Math.cos((i * Math.PI) / 4) * 100],
                  y: [0, Math.sin((i * Math.PI) / 4) * 100],
                }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.8 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SuccessAnimation;
