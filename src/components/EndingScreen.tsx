import { motion } from 'framer-motion';
import { birthdayContent } from '../data/birthdayContent';

interface EndingScreenProps {
  onReplay: () => void;
}

const { ending } = birthdayContent;

export const EndingScreen = ({ onReplay }: EndingScreenProps) => {
  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'var(--cream)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(190, 117, 104, 0.12) 0%, rgba(202, 167, 108, 0.08) 50%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.75rem',
          padding: '2.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Golden star badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 235, 230, 0.8) 100%)',
            border: '1.5px solid rgba(202, 167, 108, 0.4)',
            boxShadow: '0 8px 24px rgba(190, 117, 104, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            color: 'var(--gold-warm)',
          }}
        >
          ✦
        </motion.div>

        {/* Thin divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 48,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(190, 117, 104, 0.4), transparent)',
            transformOrigin: 'center',
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.5rem, 6vw, 2.1rem)',
            fontWeight: 400,
            color: 'var(--charcoal)',
            margin: 0,
            lineHeight: 1.3,
            letterSpacing: '-0.015em',
          }}
        >
          {ending.line1}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.1rem',
            fontStyle: 'italic',
            color: 'var(--rose)',
            margin: '-0.5rem 0 0',
          }}
        >
          {ending.signature}
        </motion.p>

        {/* Replay button */}
        <motion.button
          onClick={onReplay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          aria-label="Replay the experience"
          style={{
            marginTop: '2.5rem',
            background: 'rgba(255, 255, 255, 0.75)',
            border: '1px solid rgba(225, 215, 205, 0.8)',
            borderRadius: '2rem',
            padding: '0.6rem 1.4rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.74rem',
            fontWeight: 500,
            color: 'var(--taupe)',
            letterSpacing: '0.08em',
            textTransform: 'lowercase',
            outline: 'none',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 10px rgba(50, 35, 25, 0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.2s ease',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>{ending.replayLabel}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
