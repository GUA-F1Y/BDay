import { motion } from 'framer-motion';
import { birthdayContent } from '../data/birthdayContent';
import type { Screen } from '../types';
import { CameraIcon, MailIcon, CandleIcon, SparklesIcon, LockIcon, ChevronRightIcon } from './Icons';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  wishCompleted: boolean;
}

const { home, recipient } = birthdayContent;

const todayDateString = new Date().toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

interface CardProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  locked?: boolean;
  index: number;
  accent?: boolean;
  unlockedGlow?: boolean;
  className?: string;
}

const HomeCard = ({
  number,
  icon,
  title,
  subtitle,
  onClick,
  locked = false,
  index,
  accent = false,
  unlockedGlow = false,
  className = '',
}: CardProps) => (
  <motion.button
    custom={index}
    variants={cardVariants}
    className={className}
    onClick={!locked ? onClick : undefined}
    aria-disabled={locked}
    aria-label={`${title}: ${subtitle}`}
    whileTap={!locked ? { scale: 0.97 } : {}}
    whileHover={!locked ? { y: -3 } : {}}
    style={{
      width: '100%',
      background: accent
        ? 'linear-gradient(145deg, #2d2825 0%, #1c1917 100%)'
        : unlockedGlow
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(254, 244, 235, 0.95) 100%)'
        : 'rgba(255, 255, 255, 0.78)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: accent
        ? '1px solid rgba(202, 167, 108, 0.3)'
        : unlockedGlow
        ? '1.5px solid rgba(202, 167, 108, 0.5)'
        : '1px solid rgba(255, 255, 255, 0.9)',
      borderRadius: 22,
      padding: '1.4rem 1.5rem',
      cursor: locked ? 'default' : 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      minHeight: accent ? 120 : 135,
      boxShadow: accent
        ? '0 16px 40px -10px rgba(44, 41, 38, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
        : unlockedGlow
        ? '0 16px 40px -10px rgba(202, 167, 108, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
        : '0 10px 30px -8px rgba(60, 45, 35, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
      opacity: locked ? 0.6 : 1,
      outline: 'none',
      textAlign: 'left',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Subtle ambient light splash inside accent cards */}
    {accent && (
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(202, 167, 108, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    )}

    {/* Top row: Number badge & category icon */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '0.85rem',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: accent ? 'var(--gold-warm)' : unlockedGlow ? 'var(--rose)' : 'var(--taupe-light)',
        }}
      >
        {number}
      </span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          opacity: accent ? 0.95 : 0.85,
        }}
      >
        {icon}
      </div>
    </div>

    {/* Content */}
    <div>
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.1rem, 4.2vw, 1.25rem)',
          fontWeight: 500,
          color: accent ? 'var(--cream)' : 'var(--charcoal)',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
          margin: '0 0 0.25rem',
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem',
            fontWeight: 400,
            color: accent ? 'rgba(250, 247, 242, 0.65)' : 'var(--taupe)',
            letterSpacing: '0.01em',
            margin: 0,
            lineHeight: 1.4,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          {locked && <LockIcon size={12} color="var(--taupe-light)" />}
          <span>{subtitle}</span>
        </p>

        {!locked && (
          <ChevronRightIcon
            size={14}
            color={accent ? 'var(--gold-warm)' : 'var(--rose)'}
            style={{ opacity: 0.85, flexShrink: 0 }}
          />
        )}
      </div>
    </div>
  </motion.button>
);

export const HomeScreen = ({ onNavigate, wishCompleted }: HomeScreenProps) => {
  const { cards } = home;

  return (
    <motion.div
      className="screen grain-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: '0 0 3rem',
        background: 'var(--cream)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(190, 117, 104, 0.15) 0%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: -40,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(202, 167, 108, 0.14) 0%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '3rem 1.5rem 1rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '2.25rem' }}
        >
          {/* Decorative monogram 'C' */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '1.25rem', position: 'relative', display: 'inline-block' }}
          >
            {/* Outer ring */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                border: '1px solid rgba(202, 167, 108, 0.35)',
                boxShadow: '0 8px 24px rgba(190, 117, 104, 0.1)',
                background:
                  'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.95) 0%, rgba(250,240,230,0.85) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Inner dashed ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: 5,
                  borderRadius: '50%',
                  border: '1px dashed rgba(202, 167, 108, 0.4)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.9rem',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  lineHeight: 1,
                  background: 'linear-gradient(135deg, var(--rose) 0%, #d4956a 55%, var(--gold-warm) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                C
              </span>
            </div>
          </motion.div>

          {/* Date pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.9rem',
              borderRadius: '2rem',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 2px 10px rgba(190, 117, 104, 0.08)',
              marginBottom: '1rem',
            }}
          >
            <span style={{ fontSize: '0.55rem', color: 'var(--rose)' }}>✦</span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                color: 'var(--rose)',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              {todayDateString}
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 7.5vw, 2.75rem)',
              fontWeight: 500,
              color: 'var(--charcoal)',
              margin: '0 0 0.15rem',
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
            }}
          >
            {home.headline}
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0 0 0.75rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.75rem, 6.5vw, 2.35rem)',
                fontStyle: 'italic',
                fontWeight: 500,
                color: 'var(--rose)',
                lineHeight: 1.2,
                textShadow: '0 2px 14px rgba(190, 117, 104, 0.18)',
              }}
            >
              {recipient}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--gold-warm)' }}>✦</span>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'var(--taupe)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {home.supportingText}
          </p>

          {/* Thin decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: '1.5rem',
              height: 1,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(190, 117, 104, 0.3) 30%, rgba(202, 167, 108, 0.35) 50%, rgba(190, 117, 104, 0.3) 70%, transparent 100%)',
              transformOrigin: 'left',
            }}
          />
        </motion.div>

        {/* Cards grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.9rem',
          }}
        >
          {/* Card 1 — Memories */}
          <HomeCard
            index={0}
            number="01"
            icon={<CameraIcon size={19} color="var(--rose)" />}
            title={cards.memories.title}
            subtitle={cards.memories.subtitle}
            onClick={() => onNavigate('memories')}
          />

          {/* Card 2 — Letter */}
          <HomeCard
            index={1}
            number="02"
            icon={<MailIcon size={19} color="var(--rose)" />}
            title={cards.letter.title}
            subtitle={cards.letter.subtitle}
            onClick={() => onNavigate('letter')}
          />

          {/* Card 3 — Make A Wish — full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <HomeCard
              index={2}
              number="03"
              icon={<CandleIcon size={21} color="var(--gold-warm)" />}
              title={cards.wish.title}
              subtitle={cards.wish.subtitle}
              onClick={() => onNavigate('wish')}
              accent
              className="card-shimmer"
            />
          </div>

          {/* Card 4 — One More Thing — full width */}
          <div style={{ gridColumn: '1 / -1' }}>
            <motion.div
              animate={wishCompleted ? { opacity: 1 } : { opacity: 0.6 }}
              transition={{ duration: 0.4 }}
            >
              <HomeCard
                index={3}
                number="04"
                icon={
                  wishCompleted ? (
                    <SparklesIcon size={20} color="var(--gold-warm)" />
                  ) : (
                    <LockIcon size={17} color="var(--taupe-light)" />
                  )
                }
                title={cards.oneMoreThing.title}
                subtitle={
                  wishCompleted
                    ? cards.oneMoreThing.subtitleUnlocked
                    : cards.oneMoreThing.subtitleLocked
                }
                onClick={() => onNavigate('final')}
                locked={!wishCompleted}
                unlockedGlow={wishCompleted}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
