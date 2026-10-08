import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayContent } from '../data/birthdayContent';
import { MailIcon, ChevronDownIcon } from './Icons';

interface LetterScreenProps {
  onBack: () => void;
}

const { letter, recipient } = birthdayContent;

const paragraphVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.12 + i * 0.14,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export const LetterScreen = ({ onBack }: LetterScreenProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'var(--cream)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '-20%',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(190, 117, 104, 0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Back button */}
      <motion.button
        onClick={onBack}
        aria-label="Back to home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '1.25rem',
          zIndex: 20,
          background: 'rgba(255, 255, 255, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          borderRadius: '2rem',
          padding: '0.45rem 1.05rem',
          color: 'var(--charcoal-soft)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.75rem',
          fontWeight: 500,
          letterSpacing: '0.04em',
          cursor: 'pointer',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 10px rgba(50, 35, 25, 0.05)',
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        back
      </motion.button>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '4.75rem 1.5rem 2.5rem',
          position: 'relative',
          zIndex: 1,
          maxHeight: '100dvh',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* ── Pre-open state ── */
            <motion.div
              key="pre"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: '2.5rem',
                padding: '1rem',
              }}
            >
              {/* Envelope seal icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 235, 230, 0.8) 100%)',
                  border: '1.5px solid rgba(202, 167, 108, 0.4)',
                  boxShadow: '0 12px 30px rgba(190, 117, 104, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                <MailIcon size={28} color="var(--rose)" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.6rem, 6.5vw, 2.2rem)',
                    fontWeight: 400,
                    color: 'var(--charcoal)',
                    margin: 0,
                    lineHeight: 1.3,
                    whiteSpace: 'pre-line',
                    letterSpacing: '-0.015em',
                  }}
                >
                  {letter.preText}
                </p>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    color: 'var(--taupe)',
                    letterSpacing: '0.04em',
                  }}
                >
                  written specially for you
                </span>
              </motion.div>

              <motion.button
                onClick={() => setIsOpen(true)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.05 }}
                aria-label="Read the letter"
                style={{
                  background: 'linear-gradient(145deg, #2d2825 0%, #1c1917 100%)',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '2rem',
                  padding: '0.85rem 2.5rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--cream)',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 8px 24px rgba(44, 41, 38, 0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>{letter.buttonLabel}</span>
                <span style={{ color: 'var(--gold-warm)' }}>✦</span>
              </motion.button>
            </motion.div>
          ) : (
            /* ── Letter revealed ── */
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Luxury stationery paper card */}
              <div
                className="letter-scroll"
                style={{
                  flex: 1,
                  background: 'linear-gradient(180deg, #ffffff 0%, #fbf9f5 100%)',
                  borderRadius: 24,
                  padding: '2.25rem 1.85rem',
                  border: '1px solid rgba(225, 215, 205, 0.7)',
                  boxShadow:
                    '0 16px 40px -10px rgba(50, 35, 25, 0.09), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                  position: 'relative',
                }}
              >
                {/* Paper watermark seal at top */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    opacity: 0.65,
                  }}
                >
                  <span style={{ fontSize: '0.65rem', color: 'var(--gold-warm)' }}>✦</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.65rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--taupe)',
                      fontWeight: 600,
                    }}
                  >
                    A Note For You
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--gold-warm)' }}>✦</span>
                </div>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                >
                  {letter.paragraphs.map((para, i) => {
                    const isSignature = para.startsWith('—');
                    const isGreeting = para === `For ${recipient},`;
                    const isSubject = para.includes('Birthday') && i === 1;

                    return (
                      <motion.p
                        key={i}
                        custom={i}
                        variants={paragraphVariants}
                        style={{
                          margin: 0,
                          fontFamily:
                            isSignature || isGreeting || isSubject
                              ? 'var(--font-serif)'
                              : 'var(--font-sans)',
                          fontSize: isSubject
                            ? 'clamp(1.1rem, 4.5vw, 1.25rem)'
                            : isGreeting
                            ? '1.15rem'
                            : '0.925rem',
                          fontWeight: isSubject ? 600 : isGreeting || isSignature ? 500 : 300,
                          fontStyle: isSignature ? 'italic' : 'normal',
                          color: isSignature
                            ? 'var(--rose)'
                            : isSubject
                            ? 'var(--charcoal)'
                            : isGreeting
                            ? 'var(--rose)'
                            : 'var(--charcoal-soft)',
                          lineHeight: isSubject ? 1.3 : 1.75,
                          letterSpacing: isSignature ? '0.02em' : '0',
                          marginTop: isSubject ? '0.2rem' : 0,
                          paddingTop: isSignature ? '0.75rem' : 0,
                          borderTop: isSignature ? '1px dashed rgba(190, 117, 104, 0.25)' : 'none',
                        }}
                      >
                        {para}
                      </motion.p>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll hint — only visible when letter is open */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ opacity: 0.4, color: 'var(--taupe)' }}
          >
            <ChevronDownIcon size={16} color="var(--taupe)" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
