import { createContext, useContext } from 'react';

export type PreloaderContextType = {
  isReady: boolean;
};

export const PreloaderContext = createContext<PreloaderContextType>({ isReady: true });

export const usePreloader = () => useContext(PreloaderContext);
