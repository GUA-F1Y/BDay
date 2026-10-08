import { motion, AnimatePresence } from 'framer-motion';

interface CandleProps {
  isLit: boolean;
  onBlow: () => void;
  delay?: number;
  windTilt?: number;
  candleIndex?: number;
}

export const Candle = ({
  isLit,
  onBlow,
  delay = 0,
  windTilt = 0,
  candleIndex = 0,
}: CandleProps) => {
  // Stagger natural flame flicker timing per candle
  const flickerDelay = (candleIndex * 0.45) % 1.5;

  return (
    <motion.button
      className="candle-wrapper"
      onClick={isLit ? onBlow : undefined}
      aria-label={isLit ? `Blow out candle ${candleIndex + 1}` : `Candle ${candleIndex + 1} blown out`}
      aria-pressed={!isLit}
      disabled={!isLit}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      whileTap={isLit ? { scale: 0.94 } : {}}
    >
      {/* Flame area */}
      <div
        style={{
          position: 'relative',
          height: 36,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          overflow: 'visible',
        }}
      >
        <AnimatePresence>
          {isLit && (
            <motion.div
              className="candle-flame"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0, y: -10, transition: { duration: 0.3, ease: 'easeOut' } }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              style={{
                transformOrigin: 'bottom center',
                transform: isLit && windTilt ? `rotate(${windTilt}deg)` : undefined,
                transition: 'transform 0.15s ease-out',
                animationDelay: `${flickerDelay}s`,
              }}
            >
              {/* Layer 1: Ethereal blue root at wick */}
              <div className="flame-blue-base" />

              {/* Layer 2: Warm outer amber aura */}
              <div
                className="flame-outer"
                style={{ animationDelay: `${flickerDelay * 0.8}s` }}
              />

              {/* Layer 3: Golden peach radiant flame */}
              <div
                className="flame-inner"
                style={{ animationDelay: `${flickerDelay}s` }}
              />

              {/* Layer 4: Pure white incandescent core */}
              <div className="flame-core" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient candle glow */}
        <AnimatePresence>
          {isLit && (
            <motion.div
              className="candle-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.35 } }}
              transition={{ duration: 0.5 }}
              style={{ animationDelay: `${flickerDelay}s` }}
            />
          )}
        </AnimatePresence>

        {/* Wispy realistic smoke trails on blow-out */}
        {!isLit && (
          <div className="wispy-smoke-wrap" key="wispy-smoke">
            <div className="wispy-smoke-trail wispy-smoke-1" />
            <div className="wispy-smoke-trail wispy-smoke-2" />
            <div className="wispy-smoke-trail wispy-smoke-3" />
          </div>
        )}
      </div>

      {/* Wick with glowing ember when blown out */}
      <div
        className={`candle-wick ${!isLit ? 'candle-wick--out' : ''}`}
        style={{ margin: '0 auto' }}
      >
        {!isLit && <div className="candle-wick-ember" />}
      </div>

      {/* Candle cylinder body with gold spiral twist */}
      <motion.div
        className={`candle-body ${isLit ? 'candle-body--lit' : 'candle-body--out'}`}
        animate={isLit ? {} : { filter: 'grayscale(0.35)' }}
        transition={{ duration: 0.6 }}
      />

      {/* Brass holder cup sitting on cake frosting */}
      <div className="candle-base-holder" />

      {/* Status indicator checkmark */}
      <motion.div
        animate={{ opacity: isLit ? 0 : 0.65, scale: isLit ? 0.7 : 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        style={{
          marginTop: 6,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.68rem',
          fontWeight: 600,
          color: 'var(--taupe)',
          letterSpacing: '0.05em',
        }}
      >
        {isLit ? '' : '✓'}
      </motion.div>
    </motion.button>
  );
};

