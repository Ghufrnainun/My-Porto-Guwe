import { Fragment } from 'react';

/** "Hi, I'm *Ghufron.*" → the starred part in the italic accent face. */
export const Accent = ({ text }: { text: string }) => (
  <>
    {text.split('*').map((part, i) =>
      i % 2 ? (
        <i key={i} className="font-accent font-normal normal-case tracking-[-.02em]">
          {part}
        </i>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      ),
    )}
  </>
);
