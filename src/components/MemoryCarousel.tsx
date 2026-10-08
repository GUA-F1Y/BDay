import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { birthdayContent } from '../data/birthdayContent';
import { SafeImage } from './SafeImage';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface MemoryCarouselProps {
  onBack: () => void;
}

const { memories } = birthdayContent;
const TOTAL = memories.images.length;

export const MemoryCarousel = ({ onBack }: MemoryCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = (index: number) => {
    if (index < 0 || index >= TOTAL) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50 && current < TOTAL - 1) goTo(current + 1);
    else if (info.offset.x > 50 && current > 0) goTo(current - 1);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.94,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-60%' : '60%',
      opacity: 0,
      scale: 0.94,
    }),
  };

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'linear-gradient(180deg, #1f1d1b 0%, #171513 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Warm ambient backlight behind gallery */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 340,
          height: 340,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(190, 117, 104, 0.16) 0%, rgba(202, 167, 108, 0.08) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Controls */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '1.25rem',
          right: '1.25rem',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
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
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '2rem',
            padding: '0.45rem 1rem',
            color: 'rgba(250, 247, 242, 0.9)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
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

        {/* Counter pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '2rem',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(8px)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.72rem',
            fontWeight: 500,
            color: 'var(--gold-warm)',
            letterSpacing: '0.08em',
          }}
        >
          <span>✦</span>
          <span>
            {String(current + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
          </span>
        </motion.div>
      </div>

      {/* Card viewport */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          padding: '4.5rem 1.5rem 2rem',
        }}
      >
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.75rem',
              cursor: 'grab',
              userSelect: 'none',
              width: '100%',
            }}
            whileDrag={{ cursor: 'grabbing' }}
          >
            {/* Polaroid / Gallery Frame */}
            <div
              style={{
                width: '100%',
                maxWidth: 330,
                background: '#ffffff',
                padding: '10px 10px 18px',
                borderRadius: 18,
                boxShadow:
                  '0 24px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.15)',
                transform: `rotate(${(current % 2 === 0 ? 1 : -1) * 1.2}deg)`,
                transition: 'transform 0.4s ease',
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4/5',
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: 'var(--charcoal-soft)',
                }}
              >
                <SafeImage
                  src={memories.images[current]}
                  alt={`Memory ${current + 1}`}
                  className=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Discreet date tag on bottom of polaroid */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '0.65rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(100, 90, 80, 0.6)',
                }}
              >
                moments worth keeping ✦
              </div>
            </div>

            {/* Caption */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.45 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                maxWidth: 320,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(0.95rem, 3.8vw, 1.1rem)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'rgba(250, 247, 242, 0.9)',
                  textAlign: 'center',
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                "{memories.captions[current]}"
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Desktop / Touch Navigation Arrows */}
        {current > 0 && (
          <motion.button
            onClick={() => goTo(current - 1)}
            aria-label="Previous memory"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '46%',
              transform: 'translateY(-50%)',
              zIndex: 15,
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'var(--cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              outline: 'none',
            }}
          >
            <ChevronLeftIcon size={16} color="var(--cream)" />
          </motion.button>
        )}

        {current < TOTAL - 1 && (
          <motion.button
            onClick={() => goTo(current + 1)}
            aria-label="Next memory"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '46%',
              transform: 'translateY(-50%)',
              zIndex: 15,
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'var(--cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              outline: 'none',
            }}
          >
            <ChevronRightIcon size={16} color="var(--cream)" />
          </motion.button>
        )}
      </div>

      {/* Dot navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0 1.5rem 2.25rem',
          zIndex: 10,
        }}
      >
        {Array.from({ length: TOTAL }).map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to memory ${i + 1}`}
            animate={{
              width: i === current ? 26 : 8,
              opacity: i === current ? 1 : 0.35,
              background:
                i === current
                  ? 'linear-gradient(90deg, var(--rose) 0%, var(--gold-warm) 100%)'
                  : 'rgba(250, 247, 242, 0.6)',
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: 8,
              borderRadius: 4,
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              outline: 'none',
            }}
          />
        ))}
      </div>

      {/* Swipe hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '0.85rem',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.65rem',
          color: 'rgba(250, 247, 242, 0.6)',
          letterSpacing: '0.08em',
          textTransform: 'lowercase',
          zIndex: 5,
        }}
      >
        swipe or tap arrows to explore
      </motion.p>
    </motion.div>
  );
};
