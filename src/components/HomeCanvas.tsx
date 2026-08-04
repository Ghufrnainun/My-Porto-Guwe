import { ReactNode } from 'react';

interface HomeCanvasProps {
  children: ReactNode;
}

export function HomeCanvas({ children }: HomeCanvasProps) {
  return (
    <div className="portfolio-flow min-h-screen bg-background">
      <div className="home-ambient" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
