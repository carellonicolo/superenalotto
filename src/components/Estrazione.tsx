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
    'linear-gradient(135deg, #ff6b6b, #c41e2a)',
    'linear-gradient(135deg, #ffd93d, #f0a500)',
    'linear-gradient(135deg, #6bcb77, #2d8f3c)',
    'linear-gradient(135deg, #4d96ff, #1a3a6b)',
    'linear-gradient(135deg, #ff6bcb, #c41e6b)',
    'linear-gradient(135deg, #9b59b6, #6c3483)',
  ];
  return colors[index % colors.length];
};

const Estrazione: React.FC<EstrazioneProps> = ({ extraction, isAnimating, revealedCount }) => {
  if (!extraction) return null;

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Header */}
      <div
        className="text-xl font-black tracking-widest"
        style={{
          color: '#1a3a6b',
          fontFamily: '"Arial Black", Impact, sans-serif',
        }}
      >
        ESTRAZIONE
      </div>

      {/* Main numbers */}
      <div className="flex gap-3 flex-wrap justify-center">
        <AnimatePresence>
          {extraction.numbers.map((num, idx) => (
            <motion.div
              key={`main-${idx}`}
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={
                idx < revealedCount
                  ? { scale: 1, rotate: 0, opacity: 1 }
                  : { scale: 0, rotate: -180, opacity: 0 }
              }
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0,
              }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg"
              style={{
                background: BallColor(idx),
                boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 -2px 5px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.3)',
                fontFamily: '"Arial Black", Arial, sans-serif',
              }}
            >
              {idx < revealedCount ? num : '?'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Jolly & SuperStar */}
      <div className="flex gap-6 items-center mt-2">
        {/* Jolly */}
        <div className="flex flex-col items-center gap-1">
          <span
            className="text-xs font-bold tracking-wider"
            style={{ color: '#1a3a6b', fontFamily: 'Arial, sans-serif' }}
          >
            JOLLY
          </span>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={
              revealedCount > 6
                ? { scale: 1, opacity: 1 }
                : { scale: 0, opacity: 0 }
            }
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
              boxShadow: '0 4px 15px rgba(255,215,0,0.5), inset 0 -2px 5px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.4)',
              fontFamily: '"Arial Black", Arial, sans-serif',
            }}
          >
            {revealedCount > 6 ? extraction.jolly : '?'}
          </motion.div>
        </div>

        {/* SuperStar */}
        <div className="flex flex-col items-center gap-1">
          <span
            className="text-xs font-bold tracking-wider"
            style={{ color: '#c41e2a', fontFamily: 'Arial, sans-serif' }}
          >
            SUPERSTAR
          </span>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={
              revealedCount > 7
                ? { scale: 1, opacity: 1 }
                : { scale: 0, opacity: 0 }
            }
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-12 h-12 flex items-center justify-center text-white font-black text-lg shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #ff4444, #8b0000)',
              boxShadow: '0 4px 15px rgba(196,30,42,0.5), inset 0 -2px 5px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.3)',
              fontFamily: '"Arial Black", Arial, sans-serif',
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
