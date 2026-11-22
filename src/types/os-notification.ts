import type { OsAppId } from '@/components/os/OsShellContext';

export type OsNotificationAppId =
  | OsAppId
  | 'finder'
  | 'photos'
  | 'github'
  | 'system'
  | 'music'
  | 'calendar';

export interface OsNotification {
  id: string;
  appId: OsNotificationAppId;
  appName: string;
  appIcon: string;
  title: string;
  body: string;
  timestamp: Date;
  unread: boolean;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  silent?: boolean;
  durationMs?: number;
}

export type PushNotificationInput = Omit<
  OsNotification,
  'id' | 'timestamp' | 'unread'
> & {
  id?: string;
  timestamp?: Date;
  unread?: boolean;
};
