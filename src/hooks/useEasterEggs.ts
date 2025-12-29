import { useEffect } from 'react';

// Easter Egg D: Console message for curious developers
const CONSOLE_MESSAGE = `
%c╔════════════════════════════════════════════════════════╗
║                                                        ║
║     Hey there, curious developer!                      ║
║                                                        ║
║  Thanks for checking out my portfolio's code.          ║
║  If you're here, we probably think alike.              ║
║                                                        ║
║     Let's connect:                                     ║
║     github.com/Ghufrnainun                             ║
║     linkedin.com/in/ghufronainun                       ║
║                                                        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
`;

const CONSOLE_STYLES =
  'color: #14b8a6; font-family: monospace; font-size: 12px;';

export function useEasterEggs() {
  useEffect(() => {
    // Easter Egg D: Console message
    console.log(CONSOLE_MESSAGE, CONSOLE_STYLES);

    // Easter Egg E: G + A keyboard shortcut to GitHub
    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      pressedKeys.add(e.key.toLowerCase());

      // Check if both G and A are pressed
      if (pressedKeys.has('g') && pressedKeys.has('a')) {
        window.open('https://github.com/Ghufrnainun', '_blank');
        pressedKeys.clear();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
}
