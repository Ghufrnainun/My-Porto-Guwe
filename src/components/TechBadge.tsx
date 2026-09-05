import { CreditCard, Database, Code, Layers } from 'lucide-react';
import { getTechInfo, getSimpleIconUrl } from '@/lib/techIcons';

interface TechBadgeProps {
  tech: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export function TechBadge({ tech, size = 'sm', showIcon = true, className = '' }: TechBadgeProps) {
  const info = getTechInfo(tech);

  const renderIcon = () => {
    if (!showIcon) return null;

    if (info.slug) {
      return (
        <img
          src={getSimpleIconUrl(info.slug, info.color)}
          alt=""
          className={size === 'sm' ? 'size-3.5 shrink-0 object-contain' : 'size-4 shrink-0 object-contain'}
          loading="lazy"
          aria-hidden="true"
        />
      );
    }

    if (info.lucideIcon === 'credit-card') {
      return <CreditCard className={size === 'sm' ? 'size-3.5 shrink-0' : 'size-4 shrink-0'} style={{ color: info.color }} />;
    }

    if (info.lucideIcon === 'database') {
      return <Database className={size === 'sm' ? 'size-3.5 shrink-0' : 'size-4 shrink-0'} style={{ color: info.color }} />;
    }

    if (info.lucideIcon === 'layers') {
      return <Layers className={size === 'sm' ? 'size-3.5 shrink-0' : 'size-4 shrink-0'} style={{ color: info.color }} />;
    }

    return <Code className={size === 'sm' ? 'size-3.5 shrink-0' : 'size-4 shrink-0'} style={{ color: info.color }} />;
  };

  return (
    <span
      className={`group inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-secondary/50 font-mono transition-all duration-200 hover:border-foreground/30 hover:bg-secondary/80 ${
        size === 'sm' ? 'px-2.5 py-1 text-[9.5px] font-medium tracking-wide' : 'px-3 py-1.5 text-xs font-medium'
      } text-muted-foreground hover:text-foreground ${className}`}
      style={{
        '--brand-color': info.color,
      } as React.CSSProperties}
    >
      {renderIcon()}
      <span>{info.cleanName}</span>
    </span>
  );
}
