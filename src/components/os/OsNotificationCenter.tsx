import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BellOff, Moon, Sparkles, Trash2, X } from 'lucide-react';
import { useOsNotification } from '@/components/os/OsNotificationContext';
import type { OsNotification } from '@/types/os-notification';

const formatNotificationTime = (date: Date): string => {
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 45) return 'Just now';
  if (diffSec < 3600) return `${Math.max(1, Math.floor(diffSec / 60))}m ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

interface NotificationCardProps {
  notification: OsNotification;
  onRemove: () => void;
  onSelect: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onRemove,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className="group relative flex cursor-default flex-col overflow-hidden rounded-[18px] bg-white/60 p-3 text-left transition-all hover:bg-white/85 active:scale-[0.99] dark:bg-white/[0.07] dark:hover:bg-white/[0.12]"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={notification.appIcon}
            alt=""
            draggable={false}
            className="h-4 w-4 shrink-0 rounded-[4px] object-contain shadow-xs"
          />
          <span className="truncate text-[11px] font-semibold opacity-75">
            {notification.appName}
          </span>
          <span className="text-[10px] opacity-40">·</span>
          <span className="shrink-0 text-[10px] opacity-50">
            {formatNotificationTime(notification.timestamp)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {notification.unread && (
            <span
              aria-label="Unread"
              className="h-1.5 w-1.5 rounded-full bg-[#0a84ff]"
            />
          )}
          <button
            type="button"
            aria-label="Remove notification"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex h-4 w-4 items-center justify-center rounded-full opacity-0 transition-opacity hover:bg-black/10 group-hover:opacity-100 dark:hover:bg-white/20"
          >
            <X size={10} className="opacity-70" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-1">
        <h5 className="text-[12.5px] font-semibold leading-snug tracking-tight text-neutral-900 dark:text-neutral-100">
          {notification.title}
        </h5>
        <p className="mt-0.5 text-[11.5px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          {notification.body}
        </p>
      </div>

      {/* Action button if defined */}
      {notification.actionLabel && (
        <div className="mt-2 flex justify-end">
          <span className="rounded-full bg-[#0a84ff]/15 px-2.5 py-0.5 text-[10.5px] font-medium text-[#0a84ff] dark:bg-[#0a84ff]/25 dark:text-[#64b5f6]">
            {notification.actionLabel}
          </span>
        </div>
      )}
    </div>
  );
};

export const OsNotificationCenter: React.FC = () => {
  const {
    notifications,
    isCenterOpen,
    setIsCenterOpen,
    isFocusMode,
    markAsRead,
    removeNotification,
    clearAllNotifications,
    pushNotification,
  } = useOsNotification();

  const reduceMotion = useReducedMotion();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isCenterOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCenterOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      // Ignore clicks on the menubar clock button which toggles it
      const target = e.target as HTMLElement;
      if (target.closest('[data-notification-toggle="true"]')) return;
      if (drawerRef.current && !drawerRef.current.contains(target)) {
        setIsCenterOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCenterOpen, setIsCenterOpen]);

  return (
    <AnimatePresence>
      {isCenterOpen && (
        <motion.aside
          ref={drawerRef}
          aria-label="Notification Center"
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, x: 360 }
          }
          animate={{ opacity: 1, x: 0 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, x: 360, transition: { duration: 0.2, ease: 'easeIn' } }
          }
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 35,
            mass: 0.8,
          }}
          className="fixed bottom-[88px] right-2 top-10 z-40 flex w-[340px] max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-[24px] bg-[#f4f2f5]/85 p-3.5 text-black shadow-[0_20px_60px_rgba(0,0,0,0.38),inset_0_0_0_0.5px_rgba(255,255,255,0.35)] backdrop-blur-2xl backdrop-saturate-150 select-none dark:bg-[#251f27]/85 dark:text-white dark:shadow-[0_20px_60px_rgba(0,0,0,0.65),inset_0_0_0_0.5px_rgba(255,255,255,0.18)]"
          style={{ WebkitBackdropFilter: 'blur(30px) saturate(180%)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-semibold tracking-tight">
                Notifications
              </h3>
              {isFocusMode && (
                <span className="flex items-center gap-1 rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] font-medium text-purple-600 dark:text-purple-300">
                  <Moon size={10} />
                  DND
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  pushNotification({
                    appId: 'settings',
                    appName: 'GanOS System',
                    appIcon: '/macos-icons/settings.png',
                    title: 'System Diagnostic Test',
                    body: 'Notification system, spring physics, and audio chimes are operating at 100% capacity.',
                    actionLabel: 'OK',
                  });
                }}
                title="Send a sample notification"
                className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium text-[#0a84ff] transition-colors hover:bg-[#0a84ff]/10 dark:text-[#64b5f6]"
              >
                <Sparkles size={11} />
                Test Alert
              </button>

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium text-neutral-500 transition-colors hover:bg-black/5 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <Trash2 size={11} />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* List or Empty State */}
          <div className="mt-2.5 flex-1 overflow-y-auto space-y-2 pr-0.5 [scrollbar-width:thin]">
            {notifications.length === 0 ? (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center text-neutral-400 dark:text-neutral-500">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
                  <BellOff size={22} className="opacity-60" />
                </div>
                <p className="mt-3 text-[13px] font-medium text-neutral-700 dark:text-neutral-300">
                  No New Notifications
                </p>
                <p className="mt-0.5 text-[11px] opacity-75">
                  You are all caught up!
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <NotificationCard
                  key={item.id}
                  notification={item}
                  onRemove={() => removeNotification(item.id)}
                  onSelect={() => {
                    markAsRead(item.id);
                    item.onAction?.();
                  }}
                />
              ))
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
