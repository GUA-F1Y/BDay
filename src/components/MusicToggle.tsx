import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MusicNoteIcon } from './Icons';

interface MusicToggleProps {
  src: string;
  defaultEnabled?: boolean;
}

/**
 * MusicToggle – a discreet luxury music control button.
 * Gracefully handles missing audio files: if the audio fails to load,
 * the control hides itself rather than showing an error.
 */
export const MusicToggle = ({ src, defaultEnabled = false }: MusicToggleProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = 'none';

    audio.addEventListener('canplay', () => setAvailable(true), { once: true });
    audio.addEventListener('error', () => setAvailable(false), { once: true });

    audio.src = src;
    audio.load();
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  // Auto-play if default enabled and audio becomes available
  useEffect(() => {
    if (available && defaultEnabled) {
      audioRef.current
        ?.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [available, defaultEnabled]);

  const toggle = () => {
    if (!audioRef.current || !available) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Hide if audio file is not available
  if (available === false || available === null) return null;

  return (
    <motion.button
      onClick={toggle}
      aria-label={isPlaying ? 'Mute music' : 'Play music'}
      title={isPlaying ? 'Mute' : 'Play music'}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.06 }}
      style={{
        position: 'absolute',
        top: '1.25rem',
        right: '1.25rem',
        zIndex: 50,
        height: 36,
        padding: isPlaying ? '0 0.85rem' : '0 0.75rem',
        borderRadius: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        outline: 'none',
        boxShadow: '0 4px 16px rgba(50, 35, 25, 0.08)',
      }}
    >
      {isPlaying ? (
        <>
          {/* Animated sound equalizer bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: 12 }}>
            <motion.span
              animate={{ height: [3, 12, 5, 10, 3] }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
              style={{ width: 2, background: 'var(--rose)', borderRadius: 1 }}
            />
            <motion.span
              animate={{ height: [6, 3, 12, 4, 6] }}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
              style={{ width: 2, background: 'var(--gold-warm)', borderRadius: 1 }}
            />
            <motion.span
              animate={{ height: [8, 12, 4, 11, 8] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              style={{ width: 2, background: 'var(--rose)', borderRadius: 1 }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              fontWeight: 500,
              color: 'var(--charcoal-soft)',
              letterSpacing: '0.04em',
            }}
          >
            music
          </span>
        </>
      ) : (
        <MusicNoteIcon size={16} color="var(--taupe)" />
      )}
    </motion.button>
  );
};
