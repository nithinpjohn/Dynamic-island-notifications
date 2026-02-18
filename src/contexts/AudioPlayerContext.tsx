"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  coverUrl: string;
  audioUrl?: string;
}

export const DEMO_TRACKS: Track[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    album: "Neon Horizons",
    duration: 214,
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    title: "Ocean Pulse",
    artist: "The Deep Blue",
    album: "Submerged",
    duration: 187,
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",
  },
  {
    id: "3",
    title: "Golden Hour",
    artist: "Solaris",
    album: "Warmth",
    duration: 243,
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop",
  },
  {
    id: "4",
    title: "Electric Soul",
    artist: "Neon Pulse",
    album: "Voltage",
    duration: 198,
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&h=200&fit=crop",
  },
];

interface AudioPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number; // 0–100
  currentTime: number; // seconds
  isOpen: boolean;
  tracks: Track[];
  currentIndex: number;
  play: (track?: Track) => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (percent: number) => void;
  openPlayer: () => void;
  closePlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentTrack = DEMO_TRACKS[currentIndex];

  // Simulated playback ticker
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 0.25;
          if (next >= currentTrack.duration) {
            // Auto-advance
            setCurrentIndex(i => (i + 1) % DEMO_TRACKS.length);
            return 0;
          }
          setProgress((next / currentTrack.duration) * 100);
          return next;
        });
      }, 250);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, currentTrack.duration]);

  // Reset time on track change
  useEffect(() => {
    setCurrentTime(0);
    setProgress(0);
  }, [currentIndex]);

  const play = useCallback((track?: Track) => {
    if (track) {
      const idx = DEMO_TRACKS.findIndex(t => t.id === track.id);
      if (idx !== -1) setCurrentIndex(idx);
    }
    setIsPlaying(true);
    setIsOpen(true);
  }, []);

  const pause = useCallback(() => setIsPlaying(false), []);

  const togglePlay = useCallback(() => setIsPlaying(p => !p), []);

  const next = useCallback(() => {
    setCurrentIndex(i => (i + 1) % DEMO_TRACKS.length);
    setIsPlaying(true);
  }, []);

  const previous = useCallback(() => {
    setCurrentIndex(i => (i - 1 + DEMO_TRACKS.length) % DEMO_TRACKS.length);
    setIsPlaying(true);
  }, []);

  const seek = useCallback((percent: number) => {
    const clamped = Math.max(0, Math.min(100, percent));
    setProgress(clamped);
    setCurrentTime((clamped / 100) * currentTrack.duration);
  }, [currentTrack.duration]);

  const openPlayer = useCallback(() => setIsOpen(true), []);
  const closePlayer = useCallback(() => {
    setIsOpen(false);
    setIsPlaying(false);
  }, []);

  return (
    <AudioPlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      progress,
      currentTime,
      isOpen,
      tracks: DEMO_TRACKS,
      currentIndex,
      play,
      pause,
      togglePlay,
      next,
      previous,
      seek,
      openPlayer,
      closePlayer,
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
}
