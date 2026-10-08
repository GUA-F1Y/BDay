/**
 * Haptic vibration helper for mobile devices.
 * Gracefully falls back on unsupported devices / browsers without throwing.
 */
export const haptic = {
  /**
   * Gentle tactile pulse when a single candle is extinguished
   */
  tap: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(35);
      } catch {
        // Silently ignore if device/browser restricts vibration
      }
    }
  },

  /**
   * Celebratory multi-pulse when all candles are blown out and wish is granted
   */
  celebrate: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 60, 60, 80, 100]);
      } catch {
        // Silently ignore
      }
    }
  },
};
