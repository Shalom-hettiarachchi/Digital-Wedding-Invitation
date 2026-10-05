"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Placeholder loop. To use the couple's own song, drop the file in /public/audio and point this at it.
export const MUSIC_SRC = "/audio/placeholder-music.wav";

const VOLUME = 0.55;
const STEP_MS = 50;

export function useBackgroundMusic(src: string = MUSIC_SRC) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const wantsPlaying = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(false);

  const stopFade = useCallback(() => {
    if (fadeTimer.current) clearInterval(fadeTimer.current);
    fadeTimer.current = null;
  }, []);

  const fadeTo = useCallback(
    (target: number, ms: number, done?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;
      stopFade();
      const from = audio.volume;
      const steps = Math.max(1, Math.round(ms / STEP_MS));
      let i = 0;
      fadeTimer.current = setInterval(() => {
        i += 1;
        audio.volume = Math.min(1, Math.max(0, from + ((target - from) * i) / steps));
        if (i >= steps) {
          stopFade();
          done?.();
        }
      }, STEP_MS);
    },
    [stopFade]
  );

  useEffect(() => {
    // Created here rather than in JSX so the listeners exist before loading starts;
    // a missing file then reliably reports "unavailable" instead of failing silently.
    const audio = new Audio();
    audio.loop = true;
    audio.preload = "auto";
    const onReady = () => setAvailable(true);
    const onError = () => setAvailable(false);
    const onVisibility = () => {
      if (document.hidden) audio.pause();
      else if (wantsPlaying.current) void audio.play().catch(() => {});
    };
    audio.addEventListener("loadedmetadata", onReady);
    audio.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibility);
    audio.src = src;
    audioRef.current = audio;

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      audio.removeEventListener("loadedmetadata", onReady);
      audio.removeEventListener("error", onError);
      stopFade();
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, [src, stopFade]);

  /** Must be called from a user gesture (tap/click) or the browser will refuse to play. */
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    wantsPlaying.current = true;
    stopFade();
    audio.volume = 0;
    audio
      .play()
      .then(() => {
        setPlaying(true);
        fadeTo(VOLUME, 1800);
      })
      .catch(() => {
        wantsPlaying.current = false;
        setPlaying(false);
      });
  }, [fadeTo, stopFade]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    wantsPlaying.current = false;
    setPlaying(false);
    fadeTo(0, 450, () => audio.pause());
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (wantsPlaying.current) pause();
    else play();
  }, [pause, play]);

  return { playing, available, play, toggle };
}
