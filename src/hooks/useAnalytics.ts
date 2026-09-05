import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined;

function injectScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

/**
 * Injects Google Analytics 4 and Microsoft Clarity when their env vars are
 * configured (VITE_GA4_MEASUREMENT_ID, VITE_CLARITY_PROJECT_ID).
 * No-ops silently when unset so local/dev builds stay tracking-free.
 */
export function useAnalytics() {
  useEffect(() => {
    if (GA4_ID) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA4_ID, { send_page_view: false });
      injectScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`);
    }

    if (CLARITY_ID) {
      window.clarity =
        window.clarity ||
        function (...args: unknown[]) {
          (window.clarity as unknown as { q?: unknown[] }).q =
            (window.clarity as unknown as { q?: unknown[] }).q || [];
          (window.clarity as unknown as { q?: unknown[] }).q.push(args);
        };
      window.clarity('set', 'project_id', CLARITY_ID);
      injectScript(`https://www.clarity.ms/tag/${CLARITY_ID}`);
    }
  }, []);
}
