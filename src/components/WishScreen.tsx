import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayContent } from '../data/birthdayContent';
import { Candle } from './Candle';
import { useBlowDetector } from '../hooks/useBlowDetector';
import { haptic } from '../utils/haptics';
import { MicIcon, WindIcon, SparklesIcon } from './Icons';

interface WishScreenProps {
  onBack: () => void;
  onComplete: () => void;
  wishCompleted: boolean;
}

const { wish } = birthdayContent;

// ── Confetti particle types ───────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  dx: string;
  dy: string;
  rot: string;
  duration: string;
  delay: string;
}

const PARTICLE_COLORS = [
  'rgba(194,125,112,0.8)',  // rose
  'rgba(201,169,110,0.8)',  // gold
  'rgba(138,127,117,0.6)',  // taupe
  'rgba(250,247,242,0.9)',  // cream
  'rgba(180,165,145,0.7)',  // warm beige
];

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 30 + Math.random() * 40, // center-ish spread (%)
    y: 30 + Math.random() * 30,
    size: 4 + Math.random() * 7,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    dx: `${(Math.random() - 0.5) * 220}px`,
    dy: `${40 + Math.random() * 180}px`,
    rot: `${(Math.random() - 0.5) * 720}deg`,
    duration: `${1.2 + Math.random() * 1.4}s`,
    delay: `${Math.random() * 0.5}s`,
  }));
}

export const WishScreen = ({ onBack, onComplete, wishCompleted }: WishScreenProps) => {
  const [litCandles, setLitCandles] = useState<boolean[]>(
    Array(wish.candleCount).fill(true)
  );
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showGranted, setShowGranted] = useState(wishCompleted);
  const [userWish, setUserWish] = useState(() => {
    try {
      return localStorage.getItem('caca_birthday_wish') || '';
    } catch {
      return '';
    }
  });

  const handleWishChange = (text: string) => {
    setUserWish(text);
    try {
      localStorage.setItem('caca_birthday_wish', text);
    } catch {
      // Ignore storage errors
    }
  };

  const blownCount = litCandles.filter(lit => !lit).length;

  const blowCandle = useCallback((index: number) => {
    setLitCandles(prev => {
      if (!prev[index]) return prev;
      haptic.tap();
      const next = [...prev];
      next[index] = false;
      return next;
    });
  }, []);

  const blowNextCandle = useCallback(() => {
    setLitCandles(prev => {
      const idx = prev.findIndex(lit => lit);
      if (idx === -1) return prev;
      haptic.tap();
      const next = [...prev];
      next[idx] = false;
      return next;
    });
  }, []);

  const { isListening, hasPermission, blowIntensity, startListening, stopListening } = useBlowDetector({
    onBlow: blowNextCandle,
    enabled: blownCount < wish.candleCount && !showGranted,
  });

  const handleRelight = useCallback(() => {
    setLitCandles(Array(wish.candleCount).fill(true));
    setShowGranted(false);
  }, []);

  // When all candles blown, trigger celebration
  useEffect(() => {
    if (blownCount === wish.candleCount && !showGranted) {
      const timer = setTimeout(() => {
        haptic.celebrate();
        setParticles(createParticles(32));
        setShowGranted(true);
        onComplete();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [blownCount, showGranted, onComplete]);

  // Reset particles after they've animated
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => setParticles([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  return (
    <motion.div
      className="screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'var(--cream)',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Atmospheric dynamic room lighting responding to blown candles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: showGranted
            ? 'radial-gradient(ellipse at 50% 45%, rgba(225, 195, 120, 0.22) 0%, rgba(194, 125, 112, 0.14) 40%, transparent 72%)'
            : blownCount === 0
            ? 'radial-gradient(ellipse at 50% 48%, rgba(225, 185, 110, 0.22) 0%, rgba(194, 125, 112, 0.09) 45%, transparent 72%)'
            : blownCount === 1
            ? 'radial-gradient(ellipse at 50% 48%, rgba(225, 185, 110, 0.14) 0%, rgba(194, 125, 112, 0.05) 45%, transparent 70%)'
            : blownCount === 2
            ? 'radial-gradient(ellipse at 50% 48%, rgba(225, 185, 110, 0.08) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 50% 48%, rgba(40, 35, 30, 0.03) 0%, transparent 60%)',
          pointerEvents: 'none',
          transition: 'background-image 0.8s ease, opacity 0.8s ease',
        }}
      />

      {/* Confetti particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            '--dx': p.dx,
            '--dy': p.dy,
            '--rot': p.rot,
            '--duration': p.duration,
            '--delay': p.delay,
          } as React.CSSProperties}
        />
      ))}

      {/* Back button */}
      <motion.button
        onClick={onBack}
        aria-label="Back to home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '1.25rem',
          zIndex: 20,
          background: 'rgba(255, 255, 255, 0.65)',
          border: '1px solid rgba(138,127,117,0.22)',
          borderRadius: '2rem',
          padding: '0.45rem 1rem',
          color: 'var(--taupe)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 10px rgba(50, 40, 30, 0.04)',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        back
      </motion.button>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1.75rem 3rem',
        position: 'relative',
        zIndex: 1,
        gap: '0.9rem',
      }}>

        <AnimatePresence mode="wait">
          {!showGranted ? (
            <motion.div
              key="wish-active"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', width: '100%', maxWidth: '340px' }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.8rem, 7vw, 2.4rem)',
                  fontWeight: 400,
                  color: 'var(--charcoal)',
                  margin: 0,
                  textAlign: 'center',
                  letterSpacing: '-0.02em',
                }}
              >
                {wish.headline}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  fontWeight: 300,
                  color: 'var(--taupe)',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                {wish.supportingText}
              </motion.p>

              {/* Luxury Stationery Wish Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="wish-card-stationery"
              >
                {/* Header Tag */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <SparklesIcon size={13} color="var(--gold-warm)" />
                    <span style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.67rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--taupe)',
                    }}>
                      make a silent wish
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.62rem',
                    color: 'rgba(138, 127, 117, 0.6)',
                  }}>
                    {userWish.length}/90
                  </span>
                </div>

                {/* Input Textarea */}
                <input
                  type="text"
                  value={userWish}
                  onChange={e => handleWishChange(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }
                  }}
                  enterKeyHint="done"
                  placeholder="tulis 1 harapanmu di sini... (opsional)"
                  maxLength={90}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.92rem',
                    fontStyle: userWish ? 'italic' : 'normal',
                    color: 'var(--charcoal)',
                    outline: 'none',
                    padding: '0.3rem 0',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                  }}
                />

                {/* Sub-note */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: '0.4rem',
                  borderTop: '1px dashed rgba(212, 175, 55, 0.25)',
                  marginTop: '0.35rem',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.62rem',
                    color: userWish ? 'var(--rose)' : 'var(--taupe)',
                    letterSpacing: '0.02em',
                    opacity: 0.8,
                  }}>
                    {userWish ? '✦ harapan tersimpan rapi di dalam hati' : '✦ atau cukup pejamkan mata & ucapkan dalam hati'}
                  </span>
                </div>
              </motion.div>

              {/* Progress counter */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.72rem',
                  color: 'var(--taupe)',
                  letterSpacing: '0.1em',
                  marginTop: '0.1rem',
                  opacity: 0.7,
                }}
              >
                {blownCount} / {wish.candleCount} lilin padam
              </motion.div>

              {/* Birthday Cake with Candles */}
              <motion.div
                className="cake-stand"
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Candles row */}
                <div className="cake-candles-container">
                  {litCandles.map((lit, i) => (
                    <Candle
                      key={i}
                      candleIndex={i}
                      isLit={lit}
                      onBlow={() => blowCandle(i)}
                      delay={0.6 + i * 0.12}
                      windTilt={isListening ? blowIntensity * (i === 0 ? -14 : i === 1 ? 3 : 16) : 0}
                    />
                  ))}
                </div>

                {/* Cake structure */}
                <div className="cake-body-wrap">
                  <div className={`cake-top-frosting ${litCandles.some(Boolean) ? 'lit' : ''}`}>
                    {/* Dynamic warm reflection pool from active candles */}
                    <div
                      className="cake-top-glow"
                      style={{
                        opacity: blownCount === 0 ? 0.95 : blownCount === 1 ? 0.65 : blownCount === 2 ? 0.35 : 0,
                      }}
                    />
                    {/* 12 Cream piping pearls along the rim */}
                    <div className="cake-piping-pearls">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="cake-piping-pearl" />
                      ))}
                    </div>
                  </div>
                  <div className="cake-tier">
                    <div className="cake-ribbon" />
                  </div>
                </div>

                {/* Pedestal porcelain plate with gold rim */}
                <div className="cake-plate" />
              </motion.div>

              {/* Interaction Controls */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginTop: '0.5rem',
                }}
              >
                {/* Mic Blow Toggle Button */}
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: isListening ? 'rgba(194,125,112,0.12)' : 'rgba(255,255,255,0.7)',
                    border: `1px solid ${isListening ? 'var(--rose)' : 'rgba(138,127,117,0.25)'}`,
                    borderRadius: '2rem',
                    padding: '0.45rem 1.15rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    color: isListening ? 'var(--rose)' : 'var(--charcoal-soft)',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isListening
                      ? '0 0 16px rgba(194,125,112,0.25)'
                      : '0 2px 8px rgba(44,41,38,0.04)',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {isListening ? (
                      <WindIcon size={16} color="var(--rose)" />
                    ) : (
                      <MicIcon size={16} color="var(--charcoal-soft)" />
                    )}
                  </span>
                  <span>
                    {isListening
                      ? blowIntensity > 0.3
                        ? 'meniup lilin...'
                        : 'tiup ke arah mic HP-mu...'
                      : hasPermission === false
                      ? 'akses mic tidak diizinkan (tap lilin)'
                      : 'aktifkan tiup mic'}
                  </span>
                  {isListening && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--rose)',
                        boxShadow: '0 0 6px var(--rose)',
                        animation: 'glow-pulse 1.2s infinite',
                      }}
                    />
                  )}
                </button>

                {/* Hint */}
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.7rem',
                    color: 'var(--taupe)',
                    margin: 0,
                    letterSpacing: '0.05em',
                    opacity: 0.6,
                    textAlign: 'center',
                  }}
                >
                  {isListening
                    ? 'atau sentuh lilin langsung'
                    : 'atau sentuh masing-masing lilin untuk memadamkannya'}
                </p>
              </motion.div>
            </motion.div>
          ) : (
            /* ── Granted state ── */
            <motion.div
              key="wish-granted"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
            >
              {/* Small star-like decoration */}
              <motion.div
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(201,169,110,0.15), rgba(194,125,112,0.1))',
                  border: '1.5px solid rgba(201,169,110,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                }}
              >
                <SparklesIcon size={24} color="var(--gold-warm)" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.8rem, 7vw, 2.4rem)',
                  fontWeight: 400,
                  color: 'var(--charcoal)',
                  margin: 0,
                  textAlign: 'center',
                  letterSpacing: '-0.02em',
                }}
              >
                {wish.grantedText}
              </motion.h2>

              {/* Golden Keepsake Wish Certificate Card */}
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: '100%',
                  maxWidth: 330,
                  background: 'linear-gradient(180deg, #ffffff 0%, #faf6f0 100%)',
                  borderRadius: 22,
                  padding: '1.5rem 1.4rem',
                  border: '1.5px solid rgba(212, 175, 55, 0.38)',
                  boxShadow: '0 16px 36px rgba(50, 40, 30, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.65rem',
                  position: 'relative',
                  textAlign: 'center',
                }}
              >
                {/* Decorative corner star accents */}
                <div style={{ position: 'absolute', top: 10, left: 12, fontSize: '0.65rem', color: 'rgba(212, 175, 55, 0.55)' }}>✦</div>
                <div style={{ position: 'absolute', top: 10, right: 12, fontSize: '0.65rem', color: 'rgba(212, 175, 55, 0.55)' }}>✦</div>
                <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: '0.65rem', color: 'rgba(212, 175, 55, 0.55)' }}>✦</div>
                <div style={{ position: 'absolute', bottom: 10, right: 12, fontSize: '0.65rem', color: 'rgba(212, 175, 55, 0.55)' }}>✦</div>

                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.64rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--taupe)',
                  fontWeight: 600,
                }}>
                  {userWish.trim() ? 'your silent wish' : 'a birthday wish'}
                </span>

                {userWish.trim() ? (
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: '1.1rem',
                      color: 'var(--rose)',
                      margin: '0.15rem 0 0.35rem',
                      lineHeight: 1.55,
                      fontWeight: 400,
                    }}
                  >
                    “{userWish.trim()}”
                  </p>
                ) : (
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: '1.05rem',
                      color: 'var(--charcoal)',
                      margin: '0.15rem 0 0.35rem',
                      lineHeight: 1.5,
                      fontWeight: 400,
                    }}
                  >
                    All three candles blown.
                  </p>
                )}

                <div style={{
                  width: 36,
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)',
                  margin: '0.1rem 0',
                }} />

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    fontWeight: 300,
                    color: 'var(--taupe)',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Semoga permohonan ini, dan semua doa baik yang kamu simpan di dalam hati, terwujud satu per satu.
                </p>
              </motion.div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.85rem',
                  marginTop: '0.5rem',
                }}
              >
                <motion.button
                  onClick={onBack}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.03 }}
                  style={{
                    background: 'var(--charcoal)',
                    border: 'none',
                    borderRadius: '2rem',
                    padding: '0.85rem 2.75rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    color: 'var(--cream)',
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 4px 20px rgba(44,41,38,0.2)',
                  }}
                >
                  continue
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleRelight}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    color: 'var(--taupe)',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    outline: 'none',
                    padding: '0.4rem 0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    opacity: 0.75,
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '0.75'; }}
                >
                  <span>tiup lilin lagi</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
