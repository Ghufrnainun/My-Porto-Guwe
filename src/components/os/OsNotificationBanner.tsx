import React, { useContext } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useOsNotification } from '@/components/os/OsNotificationContext';
import { OsShellContext } from '@/components/os/OsShellContext';
import { executeNotificationAction } from '@/lib/notificationActions';
import type { OsNotification } from '@/types/os-notification';

interface OsNotificationBannerItemProps {
  notification: OsNotification;
  onDismiss: () => void;
  onSelect: () => void;
}

const OsNotificationBannerItem: React.FC<OsNotificationBannerItemProps> = ({
  notification,
  onDismiss,
  onSelect,
}) => {
  const reduceMotion = useReducedMotion();
  const shellContext = useContext(OsShellContext);
  const openApp = shellContext?.openApp;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent triggering if clicked directly on an action button or close button
    if ((e.target as HTMLElement).closest('button')) return;
    onSelect();
  };

  return (
    <motion.div
      layout
      initial={
        reduceMotion ? { opacity: 0 } : { opacity: 0, x: 60, scale: 0.94 }
      }
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, x: 60, scale: 0.94, transition: { duration: 0.2 } }
      }
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 32,
        mass: 0.8,
      }}
      onClick={handleCardClick}
      className="group pointer-events-auto relative flex w-full cursor-default flex-col overflow-hidden rounded-[20px] bg-[#f4f2f5]/85 p-3.5 text-black shadow-[0_18px_44px_rgba(0,0,0,0.38),inset_0_0_0_0.5px_rgba(255,255,255,0.35)] backdrop-blur-2xl backdrop-saturate-150 transition-colors select-none dark:bg-[#272129]/85 dark:text-white dark:shadow-[0_18px_44px_rgba(0,0,0,0.55),inset_0_0_0_0.5px_rgba(255,255,255,0.18)]"
      style={{ WebkitBackdropFilter: 'blur(25px) saturate(180%)' }}
    >
      {/* Header: App Icon, Name, Time & Close button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={notification.appIcon}
            alt=""
            draggable={false}
            className="h-5 w-5 shrink-0 rounded-[5px] object-contain shadow-sm"
          />
          <span className="truncate text-[12px] font-semibold tracking-tight opacity-75">
            {notification.appName}
          </span>
          <span className="text-[11px] opacity-40">·</span>
          <span className="shrink-0 text-[11px] font-normal opacity-50">
            now
          </span>
        </div>

        {/* Close Button on Hover */}
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="flex h-5 w-5 items-center justify-center rounded-full bg-black/5 opacity-0 transition-all hover:bg-black/15 group-hover:opacity-100 dark:bg-white/10 dark:hover:bg-white/25"
        >
          <X size={11} className="opacity-70" />
        </button>
      </div>

      {/* Content */}
      <div className="mt-1.5 flex flex-col">
        <h4 className="text-[13px] font-semibold leading-snug tracking-tight text-neutral-900 dark:text-neutral-100">
          {notification.title}
        </h4>
        <p className="mt-0.5 text-[12px] leading-relaxed text-neutral-700 opacity-90 line-clamp-2 dark:text-neutral-300">
          {notification.body}
        </p>
      </div>

      {/* Action Buttons */}
      {(notification.actionLabel || notification.secondaryActionLabel) && (
        <div className="mt-2.5 flex items-center justify-end gap-1.5">
          {notification.secondaryActionLabel && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                notification.onSecondaryAction?.();
                onDismiss();
              }}
              className="rounded-full bg-black/5 px-3 py-1 text-[11px] font-medium text-neutral-800 transition-all hover:bg-black/10 active:scale-95 dark:bg-white/10 dark:text-neutral-200 dark:hover:bg-white/20"
            >
              {notification.secondaryActionLabel}
            </button>
          )}

          {notification.actionLabel && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                executeNotificationAction(notification, openApp);
                onDismiss();
              }}
              className="rounded-full bg-[#0a84ff] px-3.5 py-1 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-[#0071e3] active:scale-95"
            >
              {notification.actionLabel}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export const OsNotificationBannerContainer: React.FC = () => {
  const { activeBanners, dismissBanner, markAsRead } = useOsNotification();
  const shellContext = useContext(OsShellContext);
  const openApp = shellContext?.openApp;

  if (activeBanners.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-3.5 top-11 z-[9999] flex w-[360px] max-w-[calc(100vw-28px)] flex-col gap-2.5"
    >
      <AnimatePresence mode="popLayout">
        {activeBanners.map((notification) => (
          <OsNotificationBannerItem
            key={notification.id}
            notification={notification}
            onDismiss={() => dismissBanner(notification.id)}
            onSelect={() => {
              markAsRead(notification.id);
              executeNotificationAction(notification, openApp);
              dismissBanner(notification.id);
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
