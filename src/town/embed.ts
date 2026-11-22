/** True when the town runs inside the GanOS "Town" window (an iframe), false on its own page at /town. */
export const embedded = typeof window !== 'undefined' && window.self !== window.top;
