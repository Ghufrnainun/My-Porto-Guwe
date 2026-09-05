import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type CardVariantType = '1' | '2' | '3';

interface VariantSwitcherProps {
  currentVariant: CardVariantType;
  onVariantChange: (v: CardVariantType) => void;
  className?: string;
}

const variants: { id: CardVariantType; label: string; tag: string }[] = [
  { id: '1', label: 'Asymmetric Spread', tag: '1' },
  { id: '2', label: 'Heroic Visual', tag: '2' },
  { id: '3', label: 'Alternating Rhythm', tag: '3' },
];

export function VariantSwitcher({
  currentVariant,
  onVariantChange,
  className = '',
}: VariantSwitcherProps) {
  return (
    <div
      role="group"
      aria-label="Project card layout variants"
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-border/60 bg-secondary/30 p-1 backdrop-blur-md',
        className
      )}
    >
      <span className="px-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 select-none">
        Layout
      </span>
      {variants.map((variant) => {
        const isActive = currentVariant === variant.id;
        return (
          <button
            key={variant.id}
            onClick={() => onVariantChange(variant.id)}
            className={cn(
              'relative rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors duration-300',
              isActive
                ? 'text-foreground font-bold'
                : 'text-muted-foreground/70 hover:text-foreground'
            )}
            aria-pressed={isActive}
            aria-label={`Switch to ${variant.label} layout`}
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
              <span className="hidden sm:inline">{variant.label}</span>
              <span className="sm:hidden">{variant.tag}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
