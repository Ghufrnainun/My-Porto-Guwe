import type { OsAppId } from '@/components/os/OsShellContext';
import type { OsNotification } from '@/types/os-notification';

export const executeNotificationAction = (
  notification: OsNotification,
  openApp?: (id: OsAppId, payload?: string) => void,
) => {
  if (notification.onAction) {
    notification.onAction();
    return;
  }

  // Fallback if no custom onAction was provided:
  const appNameLower = notification.appName.toLowerCase();
  const titleLower = notification.title.toLowerCase();
  const actionLower = notification.actionLabel?.toLowerCase() ?? '';

  if (appNameLower.includes('github') || notification.appId === 'github') {
    if (
      titleLower.includes('pr') ||
      titleLower.includes('pull request') ||
      actionLower.includes('pr')
    ) {
      window.open(
        'https://github.com/Ghufrnainun/My-Porto-Guwe/pulls',
        '_blank',
        'noopener,noreferrer',
      );
    } else {
      window.open(
        'https://github.com/Ghufrnainun/My-Porto-Guwe',
        '_blank',
        'noopener,noreferrer',
      );
    }
    return;
  }

  if (notification.appId === 'mail') {
    openApp?.('mail');
    return;
  }
  if (notification.appId === 'terminal') {
    openApp?.('terminal');
    return;
  }
  if (notification.appId === 'settings') {
    openApp?.('settings');
    return;
  }
  if (notification.appId === 'photos' || notification.appId === 'projects') {
    openApp?.('projects');
    return;
  }
  if (notification.appId === 'blog') {
    openApp?.('blog');
    return;
  }
  if (notification.appId === 'resume') {
    openApp?.('resume');
    return;
  }
  if (notification.appId === 'about') {
    openApp?.('about');
    return;
  }
  if (notification.appId === 'safari') {
    openApp?.('safari');
    return;
  }
};
