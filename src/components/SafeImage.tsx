import { useState, useRef } from 'react';
import type { CSSProperties } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * SafeImage – renders a local image or a beautiful placeholder if the file
 * is missing or fails to load. Never shows a broken-image icon.
 */
export const SafeImage = ({ src, alt, className = '', style }: SafeImageProps) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => setStatus('loaded');
  const handleError = () => setStatus('error');

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Actual image – hidden until loaded */}
      {status !== 'error' && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: status === 'loaded' ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />
      )}

      {/* Placeholder shown while loading or on error */}
      {status !== 'loaded' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #f0ead9 0%, #e8ddd0 40%, #d8cdc0 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
          }}
        >
          {/* Subtle grain texture pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(200,185,165,0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(180,165,145,0.2) 0%, transparent 40%)`,
          }} />
          {/* Decorative element */}
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '1.5px solid rgba(138,127,117,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'rgba(138,127,117,0.2)',
            }} />
          </div>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            color: 'rgba(138,127,117,0.6)',
            textTransform: 'uppercase',
            position: 'relative',
            zIndex: 1,
          }}>
            {status === 'loading' ? '...' : alt}
          </span>
        </div>
      )}
    </div>
  );
};
