import React, { ComponentType, lazy } from 'react';

/**
 * Enhanced React.lazy with automatic retry and reload recovery.
 * Resolves 'Failed to fetch dynamically imported module' errors caused by
 * Vite dev server restarts, HMR cache invalidation, network drops, or new production builds.
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  componentImport: () => Promise<{ default: T }>,
  name?: string
) {
  return lazy(async () => {
    const key = `lazy_retry_${name || 'chunk'}`;
    const hasRefreshed = sessionStorage.getItem(key);

    try {
      const component = await componentImport();
      sessionStorage.removeItem(key);
      return component;
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || '';
      const isDynamicImportError =
        errorMessage.includes('Failed to fetch dynamically imported module') ||
        errorMessage.includes('Importing a module script failed') ||
        errorMessage.includes('error loading dynamically imported module') ||
        (error as Error)?.name === 'ChunkLoadError';

      if (isDynamicImportError && !hasRefreshed) {
        // Mark as refreshed to prevent infinite loop
        sessionStorage.setItem(key, 'true');
        // Force refresh to pull fresh chunk manifests
        window.location.reload();
        return new Promise<{ default: T }>(() => {});
      }

      throw error;
    }
  });
}
