import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioCtx = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playTick = useCallback(() => {
    initAudio();
    if (!audioCtx.current) return;

    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.current.currentTime + 0.05);

    gain.gain.setValueAtTime(0.02, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(audioCtx.current.destination);

    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.05);
  }, []);

  const playSwish = useCallback(() => {
    initAudio();
    if (!audioCtx.current) return;

    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, audioCtx.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.current.currentTime + 0.1);

    gain.gain.setValueAtTime(0.01, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(audioCtx.current.destination);

    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.1);
  }, []);

  return { playTick, playSwish };
};
