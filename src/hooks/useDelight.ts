import { useEffect } from 'react';
import { toast } from 'sonner';

export function useDelight() {
  useEffect(() => {
    // Console log hint for curious devs
    console.log(
      '%c✨ GHUFRON AINUN NAJIB — PORTFOLIO ✨%c\n\nNice to see you here! Type any common color name to change the vibe! 🚀',
      'color: #14b8a6; font-size: 14px; font-weight: bold; font-family: sans-serif;',
      'color: inherit; font-size: 11px; font-family: monospace;'
    );

    // Color registry matching "mejikuhibiniu" (Red, Orange, Yellow, Green, Blue, Indigo, Violet/Purple) + Pink
    const colors: Record<string, { hsl: string; lighter: string; label: string; emoji: string }> = {
      red: { hsl: '350 89% 60%', lighter: '350 80% 68%', label: 'Ruby Red', emoji: '🔴' },
      orange: { hsl: '24 95% 53%', lighter: '24 80% 63%', label: 'Sunset Orange', emoji: '🟠' },
      yellow: { hsl: '47 95% 50%', lighter: '47 80% 60%', label: 'Amber Yellow', emoji: '🟡' },
      green: { hsl: '142 72% 50%', lighter: '142 60% 60%', label: 'Emerald Green', emoji: '🟢' },
      blue: { hsl: '217 91% 60%', lighter: '217 80% 70%', label: 'Royal Blue', emoji: '🔵' },
      indigo: { hsl: '239 84% 60%', lighter: '239 70% 70%', label: 'Midnight Indigo', emoji: '🌌' },
      purple: { hsl: '262 83% 58%', lighter: '262 70% 68%', label: 'Amethyst Purple', emoji: '🔮' },
      violet: { hsl: '262 83% 58%', lighter: '262 70% 68%', label: 'Amethyst Purple', emoji: '🔮' },
      pink: { hsl: '327 92% 58%', lighter: '327 80% 68%', label: 'Cyberpunk Pink', emoji: '🌸' },
    };

    let input = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      // Record only single character presses
      if (e.key.length === 1) {
        input = (input + e.key.toLowerCase()).slice(-10); // Keep last 10 characters

        // Check if the typed buffer ends with any registered color name
        for (const [colorName, data] of Object.entries(colors)) {
          if (input.endsWith(colorName)) {
            const html = document.documentElement;

            // Apply variables dynamically
            html.style.setProperty('--primary', data.hsl);
            html.style.setProperty('--ring', data.hsl);
            html.style.setProperty('--accent', data.hsl);
            html.style.setProperty(
              '--gradient-primary',
              `linear-gradient(135deg, hsl(${data.hsl}), hsl(${data.lighter}))`
            );
            html.style.setProperty('--shadow-soft', `0 4px 20px -2px hsl(${data.hsl} / 0.15)`);

            toast.success(`${data.emoji} ${data.label} Mode Activated!`, {
              description: `Teal accents switched to ${
                colorName.charAt(0).toUpperCase() + colorName.slice(1)
              }.`,
              duration: 3500,
            });

            input = ''; // Reset buffer
            return;
          }
        }

        // Check for reset / teal
        if (input.endsWith('teal') || input.endsWith('reset')) {
          const html = document.documentElement;

          // Clear CSS variable overrides
          html.style.removeProperty('--primary');
          html.style.removeProperty('--ring');
          html.style.removeProperty('--accent');
          html.style.removeProperty('--gradient-primary');
          html.style.removeProperty('--shadow-soft');

          toast.info('🌿 Reset to Classic Teal', {
            description: 'Standard elegant portfolio colors restored.',
            duration: 3000,
          });

          input = ''; // Reset buffer
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
