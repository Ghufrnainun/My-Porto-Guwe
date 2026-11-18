import React from 'react';
import { motion } from 'framer-motion';
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
    <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.12, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col items-center gap-3 rounded-[28px] border border-white/20 bg-[#1c1c1e]/85 px-6 py-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(255,255,255,0.15)] backdrop-blur-3xl"
      >
        <div className="flex items-center gap-3">
          {apps.map((app, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={app.id}
                className={cn(
                  'relative flex h-18 w-18 flex-col items-center justify-center rounded-[18px] p-2 transition-all duration-150',
                  isSelected
                    ? 'bg-white/20 ring-2 ring-white/60 scale-105 shadow-lg'
                    : 'bg-white/5 opacity-70 hover:opacity-100',
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
      </motion.div>
    </div>
  );
};
