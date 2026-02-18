"use client";

import { useNotifications } from "@/contexts/NotificationContext";
import { useAudioPlayer, DEMO_TRACKS } from "@/contexts/AudioPlayerContext";
import { DynamicIsland } from "@/components/DynamicIsland";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Bell,
  MessageSquare,
  Mail,
  Calendar,
  ShoppingCart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const notificationTemplates = [
  { title: "New Message", message: "Hey! How are you doing today?", icon: "💬" },
  { title: "Email Received", message: "You have a new email from john@example.com", icon: "📧" },
  { title: "Calendar Reminder", message: "Meeting starts in 15 minutes", icon: "📅" },
  { title: "New Like", message: "Sarah liked your post", icon: "❤️" },
  { title: "Order Shipped", message: "Your order #12345 has been shipped", icon: "📦" },
  { title: "Comment Added", message: "John commented on your photo", icon: "💭" },
  { title: "Payment Received", message: "You received $100.00", icon: "💰" },
  { title: "Friend Request", message: "Mike sent you a friend request", icon: "👋" },
];

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function SeekBarPage({ progress, onSeek }: { progress: number; onSeek: (p: number) => void }) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    onSeek(pct);
  };
  return (
    <div
      className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer group"
      onClick={handleClick}
    >
      <div
        className="absolute left-0 top-0 h-full bg-white rounded-full transition-[width] duration-200"
        style={{ width: `${progress}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `calc(${progress}% - 6px)` }}
      />
    </div>
  );
}

export default function Home() {
  const { addNotification } = useNotifications();
  const {
    currentTrack,
    isPlaying,
    progress,
    currentTime,
    currentIndex,
    isOpen,
    togglePlay,
    next,
    previous,
    seek,
    play,
    closePlayer,
  } = useAudioPlayer();

  const triggerRandomNotification = () => {
    const template =
      notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
    addNotification(template);
  };

  const triggerMultipleNotifications = () => {
    notificationTemplates.slice(0, 3).forEach((template, index) => {
      setTimeout(() => addNotification(template), index * 800);
    });
  };

  return (
    <>
      <DynamicIsland />

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16 pt-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-lg shadow-blue-500/20">
                <Bell className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dynamic Island
              </h1>
              <p className="text-lg text-white/50 max-w-2xl mx-auto">
                iPhone-inspired floating island at the top. Hover to expand — plays music or shows notifications.
              </p>
            </div>

            {/* ── Audio Player ─────────────────────────────────────── */}
            <Card className="mb-8 overflow-hidden bg-black/40 border-white/10 backdrop-blur-xl">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Music2 className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Music Player</h3>
                  <span className="text-white/30 text-sm ml-1">— click a track to open in Dynamic Island</span>
                </div>

                {/* Track list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {DEMO_TRACKS.map((track, i) => (
                    <motion.button
                      key={track.id}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors text-left ${
                        currentIndex === i && isOpen
                          ? "bg-white/10 border-white/20"
                          : "bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/10"
                      }`}
                      onClick={() => play(track)}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <div className="relative flex-shrink-0">
                        <motion.img
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-11 h-11 rounded-xl object-cover"
                          animate={currentIndex === i && isPlaying ? { rotate: [0, 360] } : { rotate: 0 }}
                          transition={
                            currentIndex === i && isPlaying
                              ? { duration: 8, repeat: Infinity, ease: "linear" }
                              : { duration: 0.4 }
                          }
                        />
                        {currentIndex === i && isOpen && (
                          <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                              {isPlaying ? (
                                <motion.div
                                  key="p"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <Pause className="w-4 h-4 text-white fill-white" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="pl"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <Play className="w-4 h-4 text-white fill-white" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{track.title}</p>
                        <p className="text-white/40 text-xs truncate">{track.artist}</p>
                      </div>
                      <span className="text-white/30 text-xs flex-shrink-0">
                        {formatTime(track.duration)}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Inline player controls (shown when a track is active) */}
                <AnimatePresence>
                  {isOpen && currentTrack && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: "spring", stiffness: 320, damping: 32 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center gap-4 mb-3">
                          <img
                            src={currentTrack.coverUrl}
                            alt={currentTrack.title}
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{currentTrack.title}</p>
                            <p className="text-white/40 text-xs truncate">{currentTrack.artist}</p>
                          </div>
                          <button
                            onClick={closePlayer}
                            className="text-white/30 hover:text-white/60 transition-colors text-xs"
                          >
                            Close
                          </button>
                        </div>
                        <SeekBarPage progress={progress} onSeek={seek} />
                        <div className="flex justify-between text-white/30 text-[10px] mt-1 mb-3 tabular-nums">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(currentTrack.duration)}</span>
                        </div>
                        <div className="flex items-center justify-center gap-6">
                          <button onClick={previous} className="text-white/50 hover:text-white transition-colors">
                            <SkipBack className="w-5 h-5" />
                          </button>
                          <button
                            onClick={togglePlay}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4 text-black fill-black" />
                            ) : (
                              <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                            )}
                          </button>
                          <button onClick={next} className="text-white/50 hover:text-white transition-colors">
                            <SkipForward className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {/* ── Notifications ────────────────────────────────────── */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-8 bg-black/40 border-white/10 backdrop-blur-xl hover:border-white/20 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                    <Bell className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold text-xl">Single Notification</h3>
                </div>
                <p className="text-white/40 mb-6 text-sm">
                  Trigger a random notification to see the dynamic island in action.
                </p>
                <Button onClick={triggerRandomNotification} className="w-full bg-blue-600 hover:bg-blue-500" size="lg">
                  Send Notification
                </Button>
              </Card>

              <Card className="p-8 bg-black/40 border-white/10 backdrop-blur-xl hover:border-white/20 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-white font-semibold text-xl">Multiple Notifications</h3>
                </div>
                <p className="text-white/40 mb-6 text-sm">
                  Send multiple notifications in sequence to test the queue system.
                </p>
                <Button
                  onClick={triggerMultipleNotifications}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  Send Multiple
                </Button>
              </Card>
            </div>

            {/* Quick actions */}
            <Card className="p-8 bg-black/40 border-white/10 backdrop-blur-xl">
              <h3 className="text-white font-semibold mb-6">Quick Notification Templates</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => addNotification({ title: "New Message", message: "You have a new message from Sarah", icon: "💬" })}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs">Message</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => addNotification({ title: "Email Received", message: "New email in your inbox", icon: "📧" })}
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-xs">Email</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => addNotification({ title: "Calendar Event", message: "Meeting in 30 minutes", icon: "📅" })}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="text-xs">Calendar</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => addNotification({ title: "Order Update", message: "Your order has shipped!", icon: "📦" })}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-xs">Order</span>
                </Button>
              </div>
            </Card>

            {/* Feature pills */}
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              {[
                { icon: "✨", label: "Butter Smooth", desc: "Spring-physics morphing via Framer Motion layout animations", from: "from-blue-500", to: "to-blue-600" },
                { icon: "🎵", desc: "Full player with seek, waveform, rotating art, play/pause, skip", label: "Music Player", from: "from-purple-500", to: "to-purple-600" },
                { icon: "🔔", desc: "Switch between player and notifications with one tap", label: "Multi-mode Island", from: "from-pink-500", to: "to-pink-600" },
              ].map(({ icon, label, desc, from, to }) => (
                <div key={label} className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${from} ${to} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <span className="text-3xl">{icon}</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">{label}</h4>
                  <p className="text-sm text-white/40">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
