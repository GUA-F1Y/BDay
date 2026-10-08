import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayContent } from '../data/birthdayContent';
import { SafeImage } from './SafeImage';
import { ChevronRightIcon } from './Icons';

interface FinalScreenProps {
  onContinue: () => void;
}

const { final } = birthdayContent;

export const FinalScreen = ({ onContinue }: FinalScreenProps) => {
  const [phase, setPhase] = useState<'pre' | 'reveal'>('pre');

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'linear-gradient(180deg, #1d1b19 0%, #131210 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle midnight velvet ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: -40,
          backgroundImage: `
            radial-gradient(ellipse at 40% 45%, rgba(190, 117, 104, 0.16) 0%, transparent 55%),
            radial-gradient(ellipse at 75% 30%, rgba(202, 167, 108, 0.12) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      <AnimatePresence mode="wait">
        {phase === 'pre' ? (
          /* ── Pre-open ── */
          <motion.div
            key="pre"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 2rem',
              position: 'relative',
              zIndex: 1,
              gap: '2.5rem',
              minHeight: '100dvh',
              textAlign: 'center',
            }}
          >
            {/* Top starburst decoration */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(202, 167, 108, 0.2) 0%, rgba(190, 117, 104, 0.1) 100%)',
                border: '1.5px solid rgba(202, 167, 108, 0.35)',
                boxShadow: '0 0 30px rgba(202, 167, 108, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                color: 'var(--gold-warm)',
              }}
            >
              ✦
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.75rem, 6.5vw, 2.35rem)',
                  fontWeight: 400,
                  color: 'rgba(250, 247, 242, 0.95)',
                  margin: 0,
                  letterSpacing: '-0.015em',
                  lineHeight: 1.25,
                }}
              >
                {final.preText}
              </h2>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  color: 'rgba(250, 247, 242, 0.5)',
                  letterSpacing: '0.04em',
                }}
              >
                a special message just for you
              </span>
            </motion.div>

            <motion.button
              onClick={() => setPhase('reveal')}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.06 }}
              aria-label="Open the final surprise"
              style={{
                background: 'linear-gradient(135deg, rgba(202, 167, 108, 0.18) 0%, rgba(190, 117, 104, 0.2) 100%)',
                border: '1.5px solid rgba(202, 167, 108, 0.45)',
                borderRadius: '2rem',
                padding: '0.9rem 2.85rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'rgba(250, 247, 242, 0.95)',
                letterSpacing: '0.12em',
                textTransform: 'lowercase',
                cursor: 'pointer',
                outline: 'none',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>{final.openLabel}</span>
              <span style={{ color: 'var(--gold-warm)' }}>✦</span>
            </motion.button>
          </motion.div>
        ) : (
          /* ── Reveal ── */
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              minHeight: '100dvh',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Framed Image */}
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: '100%',
                aspectRatio: '3/2',
                maxHeight: '44dvh',
                flexShrink: 0,
                position: 'relative',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              }}
            >
              <SafeImage
                src={final.image}
                alt="A special memory"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 65%, rgba(19, 18, 16, 0.8) 100%)',
                  pointerEvents: 'none',
                }}
              />
            </motion.div>

            {/* Message area */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '2rem 1.85rem 3rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.2rem, 5vw, 1.5rem)',
                  fontWeight: 500,
                  color: 'rgba(250, 247, 242, 0.96)',
                  margin: 0,
                  lineHeight: 1.3,
                  letterSpacing: '-0.015em',
                }}
              >
                {final.greeting}
              </motion.h2>

              {final.message.split('\n\n').map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.18, duration: 0.6 }}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    fontWeight: 300,
                    color: 'rgba(250, 247, 242, 0.72)',
                    margin: 0,
                    lineHeight: 1.8,
                  }}
                >
                  {para}
                </motion.p>
              ))}

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.6 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.08rem',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--rose-muted)',
                  margin: '0.5rem 0 0',
                  lineHeight: 1.5,
                }}
              >
                {final.finalLine}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.05, duration: 0.5 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'rgba(250, 247, 242, 0.55)',
                  margin: 0,
                }}
              >
                {final.signature}
              </motion.p>

              <motion.button
                onClick={onContinue}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.04 }}
                style={{
                  marginTop: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '2rem',
                  padding: '0.8rem 2.25rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: 'rgba(250, 247, 242, 0.85)',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  outline: 'none',
                  alignSelf: 'flex-start',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                  transition: 'background 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <span>continue</span>
                <ChevronRightIcon size={13} color="rgba(250, 247, 242, 0.85)" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
