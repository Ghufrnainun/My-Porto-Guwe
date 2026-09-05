import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type CardVariantType = '1' | '2' | '3';

interface VariantSwitcherProps {
  currentVariant: CardVariantType;
  onVariantChange: (v: CardVariantType) => void;
  className?: string;
}

const variants: { id: CardVariantType; label: string; tag: string }[] = [
  { id: '1', label: 'Editorial Spread', tag: '1 · Spread' },
  { id: '2', label: 'Cinema Stage', tag: '2 · Cinema' },
  { id: '3', label: 'Interactive Showcase', tag: '3 · Showcase' },
];

export function VariantSwitcher({
  currentVariant,
  onVariantChange,
  className = '',
}: VariantSwitcherProps) {
  return (
    <div
      role="group"
      aria-label="Project presentation styles"
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-border/60 bg-secondary/30 p-1 backdrop-blur-md',
        className
      )}
    >
      <span className="px-3 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 select-none hidden sm:inline">
        Concept:
      </span>
      {variants.map((variant) => {
        const isActive = currentVariant === variant.id;
        return (
          <button
            key={variant.id}
            onClick={() => onVariantChange(variant.id)}
            className={cn(
              'relative rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors duration-300',
              isActive
                ? 'text-foreground font-bold'
                : 'text-muted-foreground/70 hover:text-foreground'
            )}
            aria-pressed={isActive}
            aria-label={`Switch to ${variant.label} concept`}
          >
            {isActive && (
              <motion.span
                layoutId="activeVariantIndicator"
                className="absolute inset-0 rounded-full bg-background border border-border shadow-sm -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  isActive ? 'bg-primary' : 'bg-muted-foreground/40'
                )}
              />
              <span className="hidden md:inline">{variant.label}</span>
              <span className="md:hidden">{variant.tag}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
