"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bell, X } from 'lucide-react';

export function DynamicIsland() {
  const { notifications, clearNotifications } = useNotifications();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasNotifications = notifications.length > 0;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999]"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="relative overflow-hidden"
        onHoverStart={() => hasNotifications && setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
        layout
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
      >
        <motion.div
          className="bg-black dark:bg-gray-900 rounded-[36px] shadow-2xl backdrop-blur-xl border border-white/10"
          layout
          animate={{
            width: isExpanded ? 380 : 160,
            height: isExpanded ? 'auto' : 42,
            borderRadius: isExpanded ? 28 : 36,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
        >
          {/* Collapsed State */}
          <AnimatePresence mode="wait">
            {!isExpanded && (
              <motion.div
                key="collapsed"
                className="flex items-center justify-center h-[42px] px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="flex items-center gap-2"
                  animate={hasNotifications ? { 
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                >
                  <Bell className="w-4 h-4 text-white" />
                  {hasNotifications && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1.5"
                    >
                      <span className="text-white text-sm font-medium">
                        {notifications.length}
                      </span>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Expanded State */}
            {isExpanded && (
              <motion.div
                key="expanded"
                className="p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-white" />
                    <h3 className="text-white font-semibold text-base">Notifications</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotifications();
                    }}
                    className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {notifications.length === 0 ? (
                    <div className="text-gray-400 text-sm text-center py-4">
                      No notifications
                    </div>
                  ) : (
                    [...notifications].reverse().map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 hover:bg-white/10 rounded-2xl p-3 border border-white/5 transition-colors"
                      >
                        <div className="flex gap-3">
                          {notification.icon && (
                            <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg">
                              {notification.icon}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-white font-medium text-sm line-clamp-1">
                                {notification.title}
                              </h4>
                              <span className="text-gray-400 text-xs flex-shrink-0">
                                {formatTime(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-gray-300 text-xs mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}