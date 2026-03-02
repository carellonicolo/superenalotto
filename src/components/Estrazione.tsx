import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type ExtractionResult } from '@/lib/superenalotto';

interface EstrazioneProps {
  extraction: ExtractionResult | null;
  isAnimating: boolean;
  revealedCount: number;
}

const BallColor = (index: number) => {
  const colors = [
    'linear-gradient(135deg, hsl(0 75% 60%), hsl(0 80% 45%))',
    'linear-gradient(135deg, hsl(45 95% 55%), hsl(35 90% 45%))',
    'linear-gradient(135deg, hsl(145 55% 50%), hsl(145 60% 35%))',
    'linear-gradient(135deg, hsl(215 70% 55%), hsl(225 60% 40%))',
    'linear-gradient(135deg, hsl(330 65% 55%), hsl(340 70% 40%))',
    'linear-gradient(135deg, hsl(270 50% 55%), hsl(280 55% 40%))',
  ];
  return colors[index % colors.length];
};

const Estrazione: React.FC<EstrazioneProps> = ({ extraction, isAnimating, revealedCount }) => {
  if (!extraction) return null;

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="text-xl font-bold tracking-widest text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        ESTRAZIONE
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <AnimatePresence>
          {extraction.numbers.map((num, idx) => (
            <motion.div
              key={`main-${idx}`}
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={idx < revealedCount ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: -180, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{
                background: BallColor(idx),
                boxShadow: '0 4px 20px hsl(0 0% 0% / 0.4), inset 0 -2px 5px hsl(0 0% 0% / 0.2), inset 0 2px 5px hsl(0 0% 100% / 0.25)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {idx < revealedCount ? num : '?'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-8 items-center mt-2">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground">JOLLY</span>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={revealedCount > 6 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, hsl(45 100% 51%), hsl(30 100% 50%))',
              boxShadow: '0 4px 20px hsl(45 100% 51% / 0.4), inset 0 -2px 5px hsl(0 0% 0% / 0.2), inset 0 2px 5px hsl(0 0% 100% / 0.3)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {revealedCount > 6 ? extraction.jolly : '?'}
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs font-semibold tracking-wider text-destructive">SUPERSTAR</span>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={revealedCount > 7 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-12 h-12 flex items-center justify-center text-white font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, hsl(0 80% 55%), hsl(0 90% 30%))',
              boxShadow: '0 4px 20px hsl(0 72% 51% / 0.4), inset 0 -2px 5px hsl(0 0% 0% / 0.2), inset 0 2px 5px hsl(0 0% 100% / 0.25)',
              fontFamily: "'Space Grotesk', sans-serif",
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              width: '52px',
              height: '52px',
            }}
          >
            {revealedCount > 7 ? extraction.superstar : '?'}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Estrazione;
