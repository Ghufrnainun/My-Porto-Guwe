import { Hero } from '@/components/Hero';

type HeroPreviewProps = {
  variant: 'a' | 'b' | 'c' | 'd';
  label: string;
};

export default function HeroPreview({ variant, label }: HeroPreviewProps) {
  return (
    <main className="min-h-[100dvh] overflow-hidden bg-background">
      <div className="fixed left-4 top-4 z-[60] rounded-full border border-foreground/10 bg-background/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/60 shadow-[inset_0_1px_1px_hsl(var(--foreground)/0.08)] md:left-6 md:top-6">
        {label}
      </div>
      <Hero backgroundVariant={variant} />
    </main>
  );
}
