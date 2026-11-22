export const FOCUS =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-town-yellow';

/** Every button in town: a pill, no hard shadow. */
export const PILL = `inline-flex min-h-[44px] items-center justify-center rounded-full border-[1.5px] border-current px-3.5 py-2 transition-transform duration-150 active:scale-[.97] fine:min-h-0 ${FOCUS}`;

export const CTA = `inline-flex min-h-[44px] items-center justify-center rounded-full border-[1.5px] px-[22px] py-3.5 text-base font-semibold transition-transform duration-150 hover:-translate-y-0.5 active:scale-[.97] ${FOCUS}`;

export const MONO = 'font-mono text-[11px] font-bold uppercase tracking-[.08em]';

/** React 18 has no `inert` prop yet; spread this so hidden layers leave the tab order and the a11y tree. */
export const inertIf = (hidden: boolean): Record<string, string> => (hidden ? { inert: '' } : {});
