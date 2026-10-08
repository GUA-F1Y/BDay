import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { birthdayContent } from '../data/birthdayContent';

interface OpeningScreenProps {
  onEnter: () => void;
}

const { opening } = birthdayContent;

// Pre-generate stable particle positions
const PARTICLE_DATA = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 5 + ((i * 31 + 7) % 90),
  y: 8 + ((i * 47 + 13) % 84),
  size: 2 + (i % 4) * 1.2,
  delay: (i * 0.38) % 4.8,
  duration: 5 + (i % 5) * 1.2,
  driftX: ((i % 3) - 1) * 14,
  isGold: i % 3 === 0,
}));

export const OpeningScreen = ({ onEnter }: OpeningScreenProps) => {
  const particles = useMemo(() => PARTICLE_DATA, []);

  return (

    <motion.div
      className="screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--cream)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic ambient glowing light orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.35, 0.55, 0.35],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(190, 117, 104, 0.22) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.45, 0.25],
          x: [0, -25, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '8%',
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(202, 167, 108, 0.2) 0%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating sparkle particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, p.isGold ? 0.55 : 0.4, 0, p.isGold ? 0.5 : 0.35, 0],
            y: [0, -28, -14, -38, 0],
            x: [0, p.driftX, 0, -p.driftX * 0.5, 0],
          }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.isGold
              ? 'radial-gradient(circle, rgba(202,167,108,0.9) 0%, rgba(202,167,108,0.3) 70%)'
              : 'radial-gradient(circle, rgba(190,117,104,0.8) 0%, rgba(190,117,104,0.2) 70%)',
            boxShadow: p.isGold
              ? '0 0 6px rgba(202,167,108,0.5)'
              : '0 0 4px rgba(190,117,104,0.4)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.75rem',
          padding: '2.5rem 2rem',
          position: 'relative',
          zIndex: 1,
          maxWidth: 360,
          textAlign: 'center',
        }}
      >
        {/* Luxury top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '2rem',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 4px 16px rgba(190, 117, 104, 0.08)',
          }}
        >
          <span style={{ fontSize: '0.65rem', color: 'var(--rose)' }}>✦</span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--charcoal-soft)',
            }}
          >
            A Little Birthday Gift
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--rose)' }}>✦</span>
        </motion.div>

        {/* Main headline text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}
        >
          {(() => {
            const hasComma = opening.text.includes(',');
            const firstPart = hasComma ? opening.text.split(',')[0] + ',' : opening.text;
            const secondPart = hasComma ? opening.text.split(',').slice(1).join(',').trim() : '';

            return (
              <>
                <h1
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.75rem, 6.5vw, 2.35rem)',
                    fontWeight: 400,
                    color: 'var(--charcoal)',
                    margin: 0,
                    lineHeight: 1.25,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {firstPart}
                </h1>
                {secondPart && (
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.9rem, 7vw, 2.5rem)',
                      fontStyle: 'italic',
                      fontWeight: 500,
                      lineHeight: 1.25,
                      background: 'linear-gradient(135deg, var(--rose) 0%, #db8f80 50%, var(--gold-warm) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {secondPart}
                  </span>
                )}
              </>
            );
          })()}
        </motion.div>

        {/* Interactive centerpiece: Luxury pulsing wax seal button */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Animated concentric pulse aura */}
          <motion.div
            animate={{
              scale: [1, 1.45, 1],
              opacity: [0.45, 0, 0.45],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              width: 74,
              height: 74,
              borderRadius: '50%',
              border: '1.5px solid var(--rose)',
              pointerEvents: 'none',
            }}
          />

          <motion.div
            animate={{
              scale: [1, 1.22, 1],
              opacity: [0.6, 0.1, 0.6],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.4,
            }}
            style={{
              position: 'absolute',
              width: 74,
              height: 74,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(190, 117, 104, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Interactive Button */}
          <motion.button
            onClick={onEnter}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.08 }}
            aria-label="Open the birthday experience"
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #2f2a27 0%, #1e1b19 100%)',
              color: 'var(--cream)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(44, 41, 38, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              outline: 'none',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Inner golden seal ring */}
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: '50%',
                border: '1px dashed rgba(202, 167, 108, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem',
                  lineHeight: 1,
                  background: 'linear-gradient(135deg, #fff7ea 0%, #caa76c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ✦
              </span>
            </div>
          </motion.button>
        </div>

        {/* Soft invitation hint line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.35rem',
            margin: '-1.25rem 0 0',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.74rem',
              fontWeight: 400,
              color: 'var(--taupe)',
              letterSpacing: '0.1em',
              textTransform: 'lowercase',
            }}
          >
            tap to open
          </span>
          <motion.span
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '0.65rem', color: 'var(--rose)', opacity: 0.8 }}
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};
