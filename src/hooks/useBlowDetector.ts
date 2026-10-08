import { useState, useEffect, useRef, useCallback } from 'react';

interface UseBlowDetectorOptions {
  onBlow: () => void;
  enabled?: boolean;
}

export function useBlowDetector({ onBlow, enabled = true }: UseBlowDetectorOptions) {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [blowIntensity, setBlowIntensity] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastBlowTimeRef = useRef<number>(0);
  const onBlowRef = useRef(onBlow);

  useEffect(() => {
    onBlowRef.current = onBlow;
  }, [onBlow]);

  const releaseResources = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    releaseResources();
    setIsListening(false);
    setBlowIntensity(0);
  }, [releaseResources]);

  const startListening = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setHasPermission(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;
      setHasPermission(true);

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.25;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsListening(true);

      let blowStreak = 0;

      const checkBlow = () => {
        analyser.getByteFrequencyData(dataArray);

        // Low frequency bins (air impact against microphone diaphragm: 20Hz-250Hz, bins 1 to 8)
        let lowFreqSum = 0;
        const lowBinsCount = 8;
        for (let i = 1; i <= lowBinsCount; i++) {
          lowFreqSum += dataArray[i];
        }
        const lowFreqAvg = lowFreqSum / lowBinsCount;

        // Overall volume
        let totalSum = 0;
        for (let i = 0; i < bufferLength; i++) {
          totalSum += dataArray[i];
        }
        const totalAvg = totalSum / bufferLength;

        // Compute blow intensity (0 to 1) for UI feedback
        const intensity = Math.min(1, Math.max(0, (lowFreqAvg - 35) / 65));
        setBlowIntensity(intensity);

        const now = Date.now();
        // Condition for blowing: low frequency air disturbance + reasonable volume
        if (lowFreqAvg > 72 && totalAvg > 18) {
          blowStreak++;
          if (blowStreak >= 3 && now - lastBlowTimeRef.current > 650) {
            lastBlowTimeRef.current = now;
            blowStreak = 0;
            onBlowRef.current();
          }
        } else {
          blowStreak = Math.max(0, blowStreak - 1);
        }

        animationFrameRef.current = requestAnimationFrame(checkBlow);
      };

      animationFrameRef.current = requestAnimationFrame(checkBlow);
    } catch {
      setHasPermission(false);
      setIsListening(false);
    }
  }, []);

  // Cleanup on unmount or when disabled
  useEffect(() => {
    if (!enabled && isListening) {
      releaseResources();
      queueMicrotask(() => {
        setIsListening(false);
        setBlowIntensity(0);
      });
    }
    return () => {
      releaseResources();
    };
  }, [enabled, isListening, releaseResources]);

  return {
    isListening,
    hasPermission,
    blowIntensity,
    startListening,
    stopListening,
  };
}
