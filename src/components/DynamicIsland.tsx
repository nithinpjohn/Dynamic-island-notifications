"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import {
  Bell,
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronRight,
} from "lucide-react";

/* ─── spring presets ───────────────────────────────────────────────── */
const SPRING = { type: "spring" as const, stiffness: 380, damping: 36, mass: 0.9 };
const SPRING_SLOW = { type: "spring" as const, stiffness: 280, damping: 34, mass: 1 };

/* ─── helpers ──────────────────────────────────────────────────────── */
function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function relativeTime(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

/* ─── Waveform bars ────────────────────────────────────────────────── */
function Waveform({ active }: { active: boolean }) {
  const bars = [3, 5, 7, 5, 9, 6, 8, 4, 7, 5, 6, 3];
  return (
    <div className="flex items-end gap-[2px] h-5">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full bg-white/60"
          animate={active ? { height: [h * 1.2, h * 2.2, h * 1.2] } : { height: h }}
          transition={
            active
              ? { duration: 0.6 + i * 0.05, repeat: Infinity, ease: "easeInOut", delay: i * 0.04 }
              : { duration: 0.3 }
          }
          style={{ height: h }}
        />
      ))}
    </div>
  );
}

/* ─── Custom seek slider ───────────────────────────────────────────── */
function SeekBar({ progress, onSeek }: { progress: number; onSeek: (p: number) => void }) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    onSeek(pct);
  };
  return (
    <div
      className="relative w-full h-1 bg-white/20 rounded-full cursor-pointer group"
      onClick={handleClick}
    >
      <motion.div
        className="absolute left-0 top-0 h-full bg-white rounded-full origin-left"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `calc(${progress}% - 5px)` }}
      />
    </div>
  );
}

/* ─── Collapsed pill ───────────────────────────────────────────────── */
function CollapsedView({ isPlayer, isPlaying, coverUrl, title, notifCount }: {
  isPlayer: boolean;
  isPlaying: boolean;
  coverUrl: string;
  title: string;
  notifCount: number;
}) {
  return (
    <motion.div
      key="collapsed"
      className="flex items-center gap-2.5 px-4 h-full"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ ...SPRING, duration: 0.22 }}
    >
      {isPlayer ? (
        <>
          <motion.img
            src={coverUrl}
            alt={title}
            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
            animate={isPlaying ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={isPlaying ? { duration: 4, repeat: Infinity, ease: "linear" } : {}}
          />
          <Waveform active={isPlaying} />
          {notifCount > 0 && (
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          )}
        </>
      ) : (
        <>
          <Bell className="w-4 h-4 text-white flex-shrink-0" />
          {notifCount > 0 && (
            <>
              <span className="text-white text-sm font-medium">{notifCount}</span>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            </>
          )}
        </>
      )}
    </motion.div>
  );
}

/* ─── Player expanded ──────────────────────────────────────────────── */
function PlayerView({
  onShowNotifs,
  notifCount,
}: {
  onShowNotifs: () => void;
  notifCount: number;
}) {
  const { currentTrack, isPlaying, progress, currentTime, togglePlay, next, previous, seek } =
    useAudioPlayer();
  if (!currentTrack) return null;

  return (
    <motion.div
      key="player"
      className="p-4 w-full"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ ...SPRING_SLOW, delay: 0.06 }}
    >
      {/* Album art + info */}
      <div className="flex gap-3 mb-4">
        <motion.div
          className="relative flex-shrink-0"
          whileHover={{ scale: 1.04 }}
          transition={SPRING}
        >
          <motion.img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-14 h-14 rounded-2xl object-cover shadow-lg"
            animate={isPlaying ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={isPlaying ? { duration: 8, repeat: Infinity, ease: "linear" } : { duration: 0.4 }}
          />
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-2xl ring-2 ring-white/30"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <motion.p
            key={currentTrack.title}
            className="text-white font-semibold text-sm truncate"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={SPRING}
          >
            {currentTrack.title}
          </motion.p>
          <motion.p
            key={currentTrack.artist}
            className="text-white/60 text-xs truncate mt-0.5"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING, delay: 0.05 }}
          >
            {currentTrack.artist}
          </motion.p>
          <div className="mt-2">
            <Waveform active={isPlaying} />
          </div>
        </div>
      </div>

      {/* Seek bar + times */}
      <div className="mb-3">
        <SeekBar progress={progress} onSeek={seek} />
        <div className="flex justify-between mt-1.5">
          <span className="text-white/40 text-[10px] tabular-nums">{formatTime(currentTime)}</span>
          <span className="text-white/40 text-[10px] tabular-nums">{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <motion.button
          className="text-white/50 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          onClick={previous}
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
        >
          <SkipBack className="w-4 h-4" />
        </motion.button>

        <motion.button
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
          onClick={togglePlay}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.06 }}
          transition={SPRING}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Pause className="w-4 h-4 text-black fill-black" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Play className="w-4 h-4 text-black fill-black ml-0.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          className="text-white/50 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          onClick={next}
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
        >
          <SkipForward className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Notification peek button */}
      {notifCount > 0 && (
        <motion.button
          className="mt-3 w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 transition-colors group"
          onClick={onShowNotifs}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.18 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-3.5 h-3.5 text-white/60" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            </div>
            <span className="text-white/60 text-xs">
              {notifCount} notification{notifCount > 1 ? "s" : ""}
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/60 transition-colors" />
        </motion.button>
      )}
    </motion.div>
  );
}

/* ─── Notifications expanded ───────────────────────────────────────── */
function NotificationsView({
  onBack,
  showBack,
}: {
  onBack: () => void;
  showBack: boolean;
}) {
  const { notifications, clearNotifications } = useNotifications();

  return (
    <motion.div
      key="notifications"
      className="p-4 w-full"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ ...SPRING_SLOW, delay: 0.06 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {showBack && (
            <motion.button
              className="text-white/50 hover:text-white transition-colors p-1 -ml-1 rounded-full hover:bg-white/10"
              onClick={onBack}
              whileTap={{ scale: 0.85 }}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={SPRING}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </motion.button>
          )}
          <Bell className="w-4 h-4 text-white" />
          <h3 className="text-white font-semibold text-sm">Notifications</h3>
        </div>
        <motion.button
          onClick={(e) => { e.stopPropagation(); clearNotifications(); }}
          className="text-white/40 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
          whileTap={{ scale: 0.85 }}
        >
          <X className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-white/30 text-xs text-center py-4">No notifications</div>
        ) : (
          [...notifications].reverse().map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING, delay: i * 0.06 }}
              className="bg-white/5 hover:bg-white/10 rounded-2xl p-3 border border-white/5 transition-colors"
            >
              <div className="flex gap-2.5">
                {n.icon && (
                  <div className="w-7 h-7 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm">
                    {n.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-white font-medium text-xs leading-tight truncate">{n.title}</p>
                    <span className="text-white/30 text-[10px] flex-shrink-0">{relativeTime(n.timestamp)}</span>
                  </div>
                  <p className="text-white/50 text-[11px] mt-0.5 line-clamp-2">{n.message}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main component ───────────────────────────────────────────────── */
type ViewMode = "collapsed" | "player" | "notifications";

export function DynamicIsland() {
  const { notifications } = useNotifications();
  const { isOpen: isPlayerOpen, currentTrack, isPlaying, closePlayer } = useAudioPlayer();

  const [isHovered, setIsHovered] = useState(false);
  const [subView, setSubView] = useState<"player" | "notifications">("player");

  const isExpanded = isHovered;
  const hasNotifs = notifications.length > 0;
  const isPlayerMode = isPlayerOpen && !!currentTrack;

  // Which expanded panel to show
  const activeView: ViewMode = !isExpanded
    ? "collapsed"
    : isPlayerMode && subView === "player"
    ? "player"
    : "notifications";

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    // Default expanded sub-view
    if (isPlayerMode) setSubView("player");
  }, [isPlayerMode]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Reset back to player when re-opening
    if (isPlayerMode) setSubView("player");
  }, [isPlayerMode]);

  /* ── size targets ── */
  // We only drive borderRadius via animate; width/height come from `layout`
  // so framer can interpolate them smoothly without conflicting animations.
  const expandedWidth = isPlayerMode ? 340 : 360;

  return (
    <LayoutGroup>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999]">
        <motion.div
          layout
          layoutRoot
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ originX: 0.5, originY: 0 }}
          initial={{ y: -80, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={SPRING}
        >
          <motion.div
            layout
            className="bg-black/95 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] border border-white/[0.08] overflow-hidden"
            style={{ originX: 0.5, originY: 0 }}
            animate={{
              borderRadius: isExpanded ? 26 : 999,
              width: isExpanded ? expandedWidth : isPlayerMode ? 168 : 148,
              minHeight: isExpanded ? "auto" : 42,
            }}
            transition={SPRING}
          >
            {/* Fixed height collapsed bar so layout doesn't jerk */}
            <motion.div
              animate={{ height: isExpanded ? 0 : 42 }}
              transition={SPRING}
              className="overflow-hidden"
            >
              <CollapsedView
                isPlayer={isPlayerMode}
                isPlaying={isPlaying}
                coverUrl={currentTrack?.coverUrl ?? ""}
                title={currentTrack?.title ?? ""}
                notifCount={notifications.length}
              />
            </motion.div>

            {/* Expanded content */}
            <AnimatePresence mode="wait" initial={false}>
              {isExpanded && (
                <>
                  {activeView === "player" && (
                    <PlayerView
                      key="player-view"
                      onShowNotifs={() => setSubView("notifications")}
                      notifCount={notifications.length}
                    />
                  )}
                  {activeView === "notifications" && (
                    <NotificationsView
                      key="notif-view"
                      showBack={isPlayerMode}
                      onBack={() => setSubView("player")}
                    />
                  )}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </LayoutGroup>
  );
}
