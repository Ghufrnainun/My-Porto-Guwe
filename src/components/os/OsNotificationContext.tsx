import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  OsNotification,
  PushNotificationInput,
} from '@/types/os-notification';
import { GANOS_VERSION } from '@/components/os/OsShellContext';
import {
  isSoundEnabled,
  playNotificationChime,
  setSoundEnabled as persistSoundEnabled,
} from '@/lib/soundEffects';

interface OsNotificationContextValue {
  notifications: OsNotification[];
  activeBanners: OsNotification[];
  unreadCount: number;
  isCenterOpen: boolean;
  setIsCenterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFocusMode: boolean;
  setIsFocusMode: React.Dispatch<React.SetStateAction<boolean>>;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  appBadges: Record<string, number | string>;
  setAppBadge: (appId: string, value: number | string | null) => void;
  clearAppBadge: (appId: string) => void;
  pushNotification: (input: PushNotificationInput) => string;
  dismissBanner: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const OsNotificationContext = createContext<OsNotificationContextValue | null>(
  null,
);

const DND_STORAGE_KEY = 'ganos-dnd-mode';
const BANNER_AUTO_DISMISS_MS = 6000;
const MAX_ACTIVE_BANNERS = 3;

const getInitialNotifications = (): OsNotification[] => [
  {
    id: 'init-mail-1',
    appId: 'mail',
    appName: 'Mail',
    appIcon: '/macos-icons/mail.png',
    title: 'Ghufron Ainun Najib',
    body: 'Welcome to my portfolio! Feel free to explore the projects or send an inquiry.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    unread: true,
    actionLabel: 'Open Mail',
  },
  {
    id: 'init-gh-1',
    appId: 'github',
    appName: 'GitHub',
    appIcon: '/macos-icons/finder.png',
    title: 'ghufrnainun pushed to main',
    body: "Repository 'My-Porto-Guwe': 'feat: integrate Notification Center & audio haptics'",
    timestamp: new Date(Date.now() - 32 * 60 * 1000),
    unread: false,
    actionLabel: 'View Commit',
    onAction: () =>
      window.open('https://github.com/Ghufrnainun/My-Porto-Guwe', '_blank'),
  },
  {
    id: 'init-sys-1',
    appId: 'settings',
    appName: 'System',
    appIcon: '/macos-icons/settings.png',
    title: `Desktop Portfolio v${GANOS_VERSION}`,
    body: 'Interactive desktop widgets, Spotlight (⌘K), and Web Audio haptics are ready.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unread: false,
  },
  {
    id: 'init-blog-1',
    appId: 'blog',
    appName: 'Writing Log',
    appIcon: '/macos-icons/folder-documents.png',
    title: 'Technical Notes Published',
    body: 'Latest case studies on frontend engineering and reactive architectures are ready to read.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unread: false,
  },
];

export const OsNotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<OsNotification[]>(() =>
    getInitialNotifications(),
  );
  const [activeBanners, setActiveBanners] = useState<OsNotification[]>([]);
  const [isCenterOpen, setIsCenterOpen] = useState(false);

  const [isFocusMode, setIsFocusModeState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.localStorage.getItem(DND_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() =>
    isSoundEnabled(),
  );

  const [appBadges, setAppBadges] = useState<Record<string, number | string>>({
    mail: 1, // Start with 1 unread inquiry from Ghufron
  });

  const isFocusModeRef = useRef(isFocusMode);
  isFocusModeRef.current = isFocusMode;

  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const setIsFocusMode = useCallback(
    (action: React.SetStateAction<boolean>) => {
      setIsFocusModeState((prev) => {
        const next = typeof action === 'function' ? action(prev) : action;
        try {
          window.localStorage.setItem(DND_STORAGE_KEY, String(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  const setSoundEnabled = useCallback(
    (action: React.SetStateAction<boolean>) => {
      const next =
        typeof action === 'function' ? action(soundEnabledRef.current) : action;
      soundEnabledRef.current = next;
      persistSoundEnabled(next);
      setSoundEnabledState(next);
    },
    [],
  );

  const setAppBadge = useCallback(
    (appId: string, value: number | string | null) => {
      setAppBadges((prev) => {
        if (value === null || value === 0 || value === '') {
          const next = { ...prev };
          delete next[appId];
          return next;
        }
        return { ...prev, [appId]: value };
      });
    },
    [],
  );

  const clearAppBadge = useCallback((appId: string) => {
    setAppBadges((prev) => {
      if (!prev[appId]) return prev;
      const next = { ...prev };
      delete next[appId];
      return next;
    });
  }, []);

  const dismissBanner = useCallback((id: string) => {
    setActiveBanners((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, unread: false })),
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    setActiveBanners((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setActiveBanners([]);
  }, []);

  const pushNotification = useCallback(
    (input: PushNotificationInput): string => {
      const id = input.id ?? `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newNotification: OsNotification = {
        ...input,
        id,
        timestamp: input.timestamp ?? new Date(),
        unread: input.unread ?? true,
      };

      // Play audio chime if allowed
      if (
        soundEnabledRef.current &&
        !isFocusModeRef.current &&
        !newNotification.silent
      ) {
        playNotificationChime();
      }

      // Add to notification center history
      setNotifications((prev) => [newNotification, ...prev]);

      // Pop floating banner if not silenced or in DND
      if (!isFocusModeRef.current && !newNotification.silent) {
        setActiveBanners((prev) => {
          const filtered = prev.filter((item) => item.id !== id);
          return [newNotification, ...filtered].slice(0, MAX_ACTIVE_BANNERS);
        });

        // Set auto-dismiss timer for the banner
        const dismissDelay =
          newNotification.durationMs ?? BANNER_AUTO_DISMISS_MS;
        setTimeout(() => {
          setActiveBanners((prev) => prev.filter((item) => item.id !== id));
        }, dismissDelay);
      }

      return id;
    },
    [],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  );

  const value = useMemo(
    () => ({
      notifications,
      activeBanners,
      unreadCount,
      isCenterOpen,
      setIsCenterOpen,
      isFocusMode,
      setIsFocusMode,
      soundEnabled,
      setSoundEnabled,
      appBadges,
      setAppBadge,
      clearAppBadge,
      pushNotification,
      dismissBanner,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAllNotifications,
    }),
    [
      notifications,
      activeBanners,
      unreadCount,
      isCenterOpen,
      isFocusMode,
      setIsFocusMode,
      soundEnabled,
      setSoundEnabled,
      appBadges,
      setAppBadge,
      clearAppBadge,
      pushNotification,
      dismissBanner,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAllNotifications,
    ],
  );

  return (
    <OsNotificationContext.Provider value={value}>
      {children}
    </OsNotificationContext.Provider>
  );
};

const defaultInertContext: OsNotificationContextValue = {
  notifications: [],
  activeBanners: [],
  unreadCount: 0,
  isCenterOpen: false,
  setIsCenterOpen: () => {},
  isFocusMode: false,
  setIsFocusMode: () => {},
  soundEnabled: true,
  setSoundEnabled: () => {},
  appBadges: {},
  setAppBadge: () => {},
  clearAppBadge: () => {},
  pushNotification: () => '',
  dismissBanner: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  removeNotification: () => {},
  clearAllNotifications: () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOsNotification = (): OsNotificationContextValue => {
  const context = useContext(OsNotificationContext);
  return context ?? defaultInertContext;
};
