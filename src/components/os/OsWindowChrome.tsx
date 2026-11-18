import React, { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useWindowFocus } from '@/components/os/OsShellContext';

export const Avatar: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#a8adb8] to-[#7e838f] font-medium tracking-wide text-white select-none',
      className
    )}
  >
    GA
  </div>
);

interface ToolbarProps {
  title?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  center?: ReactNode;
  hasControls?: boolean;
  centerTitle?: boolean;
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  leading,
  trailing,
  center,
  hasControls,
  centerTitle,
  className,
}) => {
  const isFocused = useWindowFocus();

  return (
    <div
      className={cn(
        'handle relative flex h-[52px] shrink-0 items-center gap-2.5 px-3 transition-opacity duration-200',
        hasControls && 'pl-[92px]',
        !isFocused && '[&>*]:opacity-50',
        className
      )}
    >
      {leading}
      {title && (
        <div
          className={cn(
            'truncate text-[15px] font-bold',
            centerTitle && 'pointer-events-none absolute inset-x-28 text-center'
          )}
        >
          {title}
        </div>
      )}
      {center ? (
        <div className="flex min-w-0 flex-grow justify-center">{center}</div>
      ) : (
        <div className="flex-grow" />
      )}
      {trailing}
    </div>
  );
};

export const ToolbarGroup: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={cn(
      'flex h-9 items-center rounded-full bg-white/80 px-1 shadow-[0_1px_3px_rgba(0,0,0,0.12),inset_0_0_0_0.5px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:bg-white/[0.07] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_0.5px_0_rgba(255,255,255,0.15),inset_0_0_0_0.5px_rgba(255,255,255,0.08)]',
      className
    )}
  >
    {children}
  </div>
);

interface ToolbarButtonProps {
  icon: ReactNode;
  title: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  title,
  onClick,
  isActive,
  disabled,
  className,
}) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-black/75 transition-all duration-100 ease-out enabled:active:scale-[0.94] enabled:active:bg-black/10 disabled:opacity-30 dark:text-white/85 dark:enabled:active:bg-white/15',
      isActive && 'bg-black/10 dark:bg-white/15',
      className
    )}
  >
    {icon}
  </button>
);

export interface SidebarItem {
  id: string;
  label: string;
  icon?: ReactNode;
  dot?: string;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
  selectedId: string;
  onSelect: (id: string) => void;
  header?: ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  selectedId,
  onSelect,
  header,
  className,
}) => (
  <aside
    className={cn(
      'flex w-52 shrink-0 select-none flex-col border-r border-black/5 max-sm:w-36 dark:border-white/[0.06]',
      className
    )}
  >
    <div className="handle h-[52px] shrink-0" />
    {header}
    <nav className="flex-grow overflow-y-auto px-2.5 pb-3">
      {sections.map((section, index) => (
        <div key={section.title ?? index} className="mb-3">
          {section.title && (
            <div className="px-2 pb-1 text-[11px] font-bold text-black/40 dark:text-white/35">
              {section.title}
            </div>
          )}
          {section.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                'flex h-8 w-full cursor-default items-center gap-2 rounded-lg px-2 text-left text-[13px] transition-all duration-100 ease-out active:scale-[0.98]',
                selectedId === item.id
                  ? 'bg-black/[0.08] font-medium dark:bg-white/10'
                  : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
              )}
            >
              {item.dot && (
                <span
                  className={cn(
                    'mx-[3px] h-3 w-3 shrink-0 rounded-full',
                    item.dot
                  )}
                />
              )}
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      ))}
    </nav>
  </aside>
);

export const SettingsGroup: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <div className="divide-y divide-black/5 rounded-xl bg-white px-4 ring-[0.5px] ring-black/5 dark:divide-white/[0.07] dark:bg-white/[0.05] dark:ring-white/10">
    {children}
  </div>
);

export const SettingsRow: React.FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex min-h-[44px] items-center justify-between gap-4 py-2">
    <div className="text-[13px]">{label}</div>
    {children}
  </div>
);
