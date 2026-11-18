import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';

export type NoteContext = { note: string; setNote: Dispatch<SetStateAction<string>>; activePath?: string };
export const OsShellContext = createContext<NoteContext | null>(null);

export const useOsNote = () => {
  const context = useContext(OsShellContext);
  if (!context) throw new Error('useOsNote must be used inside OsShell');
  return context;
};
