import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, RotateCcw, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OsAppId, OsLanguage, TrashItem } from '@/components/os/OsShellContext';

export { DEFAULT_TRASH_EASTER_EGGS } from '@/components/os/OsShellContext';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface TrashPopoverProps {
  isOpen: boolean;
  language: OsLanguage;
  items: TrashItem[];
  hasDeletedDesktopItems: boolean;
  onRestoreItem: (id: string) => void;
  onRestoreAll: () => void;
  onRestoreDesktopItems: () => void;
  onEmptyTrash: () => void;
  onOpenApp: (id: OsAppId) => void;
  onClose: () => void;
}

const EASE_OUT_EXPO = [0.23, 1, 0.32, 1] as const;

export const TrashPopover: React.FC<TrashPopoverProps> = ({
  isOpen,
  language,
  items,
  hasDeletedDesktopItems,
  onRestoreItem,
  onRestoreAll,
  onRestoreDesktopItems,
  onEmptyTrash,
  onOpenApp,
  onClose,
}) => {
  const reduceMotion = useReducedMotion();
  const isId = language === 'id';
  const panelRef = useRef<HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [anchorPos, setAnchorPos] = useState<{ right: number; bottom: number }>({
    right: 20,
    bottom: 92,
  });

  const restorableCount = items.filter((item) => item.kind !== 'easter-egg').length;

  useEffect(() => {
    if (!isOpen) {
      setSelectedId(null);
    }
  }, [isOpen]);

  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return;
    const updateAnchor = () => {
      const trashEl = document.querySelector<HTMLElement>('[data-dock-id="trash"]');
      if (!trashEl) {
        setAnchorPos({ right: 16, bottom: 92 });
        return;
      }
      const rect = trashEl.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cardW = Math.min(340, vw - 24);
      const desiredRight = Math.max(12, vw - rect.right - 12);
      const clampedRight = Math.min(desiredRight, Math.max(12, vw - cardW - 12));
      const bottom = Math.max(88, vh - rect.top + 14);
      setAnchorPos({ right: clampedRight, bottom });
    };
    updateAnchor();
    window.addEventListener('resize', updateAnchor);
    return () => window.removeEventListener('resize', updateAnchor);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      if (target.closest('[data-dock-id="trash"]')) return;
      onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onPointerDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          ref={panelRef}
          role="dialog"
          aria-label={isId ? 'Tempat Sampah' : 'Trash'}
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.95, y: 8 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            reduceMotion
              ? { opacity: 0, transition: { duration: 0.12 } }
              : {
                  opacity: 0,
                  scale: 0.96,
                  y: 6,
                  transition: { duration: 0.14, ease: EASE_OUT_EXPO },
                }
          }
          transition={{ duration: reduceMotion ? 0.12 : 0.22, ease: EASE_OUT_EXPO }}
          style={{
            right: anchorPos.right,
            bottom: anchorPos.bottom,
            transformOrigin: 'bottom right',
          }}
          className={cn(
            'pointer-events-auto fixed z-[38] w-[min(340px,calc(100vw-24px))] overflow-hidden',
            'rounded-[20px] bg-[#f5f5f7]/[0.94] text-[#111216] ring-1 ring-black/[0.12]',
            'shadow-[0_24px_60px_-12px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.65)]',
            'backdrop-blur-2xl backdrop-saturate-150',
            'dark:bg-[#19191d]/[0.92] dark:text-[#f5f5f7] dark:ring-white/[0.14]',
            'dark:shadow-[0_28px_68px_-12px_rgba(0,0,0,0.74),inset_0_1px_0_rgba(255,255,255,0.12)]',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-black/[0.08] px-3.5 py-2.5 dark:border-white/[0.08]">
            <div className="flex min-w-0 items-center gap-2">
              <img
                src="/macos-icons/trash.png"
                alt=""
                width={20}
                height={20}
                draggable={false}
                className="h-5 w-5 shrink-0 object-contain"
              />
              <h2 className="truncate text-[13px] font-semibold tracking-[-0.01em]">
                {isId ? 'Sampah' : 'Trash'}
              </h2>
              <span className="rounded-full bg-black/[0.06] px-1.5 py-[1px] text-[10.5px] font-medium tabular-nums text-black/55 dark:bg-white/[0.1] dark:text-white/60">
                {items.length}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                disabled={items.length === 0}
                onClick={onEmptyTrash}
                className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#ff3b30]/12 px-2.5 py-1 text-[11px] font-semibold text-[#d70015] transition-[background-color,transform,opacity] duration-150 ease-smooth-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] disabled:pointer-events-none disabled:opacity-35 dark:bg-[#ff453a]/18 dark:text-[#ff6961] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#ff3b30]/20"
              >
                <Trash2 className="h-3 w-3" />
                <span>{isId ? 'Kosongkan' : 'Empty'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label={isId ? 'Tutup sampah' : 'Close Trash'}
                className="flex h-6 w-6 items-center justify-center rounded-full text-black/45 transition-[background-color,color,transform] duration-150 active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:text-white/50 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-black/[0.07] [@media(hover:hover)_and_(pointer:fine)]:hover:text-black dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.1] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[290px] overflow-y-auto overscroll-contain p-2">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-7 text-center">
                <p className="text-[12.5px] font-medium text-black/65 dark:text-white/65">
                  {isId ? 'Tempat sampah kosong.' : 'Trash is clean and empty.'}
                </p>
                <p className="mt-1 text-[11px] text-black/45 dark:text-white/40">
                  {isId
                    ? 'Seret ikon desktop atau widget ke sini untuk membuangnya.'
                    : 'Drag any desktop icon or widget onto Trash to toss it.'}
                </p>
                {hasDeletedDesktopItems && (
                  <button
                    type="button"
                    onClick={onRestoreDesktopItems}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-black/[0.07] px-3 py-1.5 text-[11.5px] font-medium text-black/80 transition-[background-color,transform] duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:bg-white/[0.1] dark:text-white/85 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-black/[0.12] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.16]"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>{isId ? 'Kembalikan item desktop' : 'Restore desktop items'}</span>
                  </button>
                )}
              </div>
            ) : (
              <ul className="space-y-1">
                {items.map((item) => {
                  const isExpanded = selectedId === item.id;
                  const note = isId ? item.noteId ?? item.noteEn : item.noteEn ?? item.noteId;
                  const actionLabel = isId
                    ? item.actionLabelId ?? item.actionLabelEn
                    : item.actionLabelEn ?? item.actionLabelId;

                  return (
                    <li
                      key={item.id}
                      className="overflow-hidden rounded-[12px] bg-black/[0.03] ring-1 ring-black/[0.04] transition-colors dark:bg-white/[0.04] dark:ring-white/[0.06]"
                    >
                      <div className="flex items-center gap-2.5 px-2.5 py-2">
                        <button
                          type="button"
                          onClick={() =>
                            item.kind === 'easter-egg'
                              ? setSelectedId((curr) => (curr === item.id ? null : item.id))
                              : undefined
                          }
                          className={cn(
                            'flex min-w-0 flex-1 items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] rounded-md',
                            item.kind === 'easter-egg' ? 'cursor-pointer' : 'cursor-default',
                          )}
                        >
                          <img
                            src={item.icon}
                            alt=""
                            width={26}
                            height={26}
                            draggable={false}
                            className="h-[26px] w-[26px] shrink-0 object-contain"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[12px] font-medium leading-tight">
                              {item.label}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-black/50 dark:text-white/45">
                              <span>{item.sizeLabel}</span>
                              {item.kind === 'easter-egg' && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span>{isId ? 'klik intip' : 'click to inspect'}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </button>

                        {item.kind !== 'easter-egg' && (
                          <button
                            type="button"
                            onClick={() => onRestoreItem(item.id)}
                            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-black/[0.07] px-2.5 py-1 text-[11px] font-medium text-black/80 transition-[background-color,transform] duration-150 ease-smooth-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:bg-white/[0.11] dark:text-white/90 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-black/[0.12] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.18]"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>{isId ? 'Kembalikan' : 'Put Back'}</span>
                          </button>
                        )}
                      </div>

                      {item.kind === 'easter-egg' && isExpanded && note && (
                        <div className="border-t border-black/[0.06] bg-black/[0.025] px-3 py-2 text-[11.5px] leading-relaxed text-black/70 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white/70">
                          <p className="font-normal">{note}</p>
                          {item.actionAppId && actionLabel && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenApp(item.actionAppId!);
                              }}
                              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#0066cc] transition-opacity active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:text-[#66b2ff] [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-80"
                            >
                              <span>{actionLabel}</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 border-t border-black/[0.07] px-3.5 py-2 text-[10.5px] text-black/50 dark:border-white/[0.08] dark:text-white/45">
            <span className="truncate">
              {isId
                ? 'Seret ikon/widget ke Trash untuk membuang'
                : 'Drag icons or widgets onto Trash'}
            </span>
            {(restorableCount > 0 || hasDeletedDesktopItems) && (
              <button
                type="button"
                onClick={restorableCount > 0 ? onRestoreAll : onRestoreDesktopItems}
                className="shrink-0 whitespace-nowrap font-semibold text-[#0066cc] transition-opacity active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] dark:text-[#66b2ff] [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-80"
              >
                {isId ? 'Pulihkan Semua' : 'Restore All'}
              </button>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
