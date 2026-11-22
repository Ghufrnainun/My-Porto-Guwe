import React from 'react';
import { cn } from '@/lib/utils';
import type { OsAppId } from '@/components/os/OsShellContext';

export interface AppSwitcherItem {
  id: OsAppId;
  title: string;
  icon: string;
}

interface AppSwitcherHUDProps {
  isOpen: boolean;
  apps: AppSwitcherItem[];
  selectedIndex: number;
}

export const AppSwitcherHUD: React.FC<AppSwitcherHUDProps> = ({
  isOpen,
  apps,
  selectedIndex,
}) => {
  if (!isOpen || apps.length === 0) return null;

  const currentApp = apps[selectedIndex] ?? apps[0];

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center select-none"
    >
      {/* Keyboard-initiated switcher opens instantaneously with zero animation lag */}
      <div className="flex flex-col items-center gap-3 rounded-[28px] border border-white/20 bg-[#1c1c1e]/90 px-5 py-4 text-white shadow-[0_24px_60px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl">
        <div className="flex items-center gap-2.5">
          {apps.map((app, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={app.id}
                className={cn(
                  'relative flex h-[68px] w-[68px] flex-col items-center justify-center rounded-[14px] p-2 transition-[transform,opacity,background-color] duration-100 ease-out',
                  isSelected
                    ? 'scale-105 bg-white/20 shadow-lg ring-2 ring-white/60'
                    : 'bg-white/5 opacity-65',
                )}
              >
                <img
                  src={app.icon}
                  alt={app.title}
                  className="h-12 w-12 object-contain drop-shadow"
                />
              </div>
            );
          })}
        </div>

        <div className="text-[13px] font-semibold tracking-tight text-white/90">
          {currentApp?.title}
        </div>
      </div>
    </div>
  );
};
