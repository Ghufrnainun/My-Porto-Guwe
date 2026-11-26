import { memo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickMemoWidgetProps {
  note: string;
  onChangeNote: (value: string) => void;
  onOpenNotes: () => void;
  size: { width: number; height: number };
}

export const QuickMemoWidget = memo(function QuickMemoWidget({
  note,
  onChangeNote,
  onOpenNotes,
  size,
}: QuickMemoWidgetProps) {
  const isCompact = size.height < 130;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#fcfaf2] text-[#1c1917] select-none">
      {/* Signature Apple Notes Warm Gold Header Band */}
      <div
        className={cn(
          'relative flex shrink-0 items-center justify-between gap-2 px-3.5',
          isCompact ? 'py-2' : 'py-2.5'
        )}
        style={{
          background:
            'linear-gradient(180deg, #f8cc46 0%, #efb827 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.45)',
        }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[12.5px] font-semibold tracking-[-0.015em] text-[#2b1e05]">
            Quick Memo
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenNotes}
          className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-black/[0.08] px-2.5 py-0.5 text-[10.5px] font-medium text-[#2b1e05] transition-[background-color,transform] duration-150 ease-out-spring hover:bg-black/[0.15] active:scale-95"
        >
          <span>Notes</span>
          <ArrowUpRight className="h-3 w-3 opacity-75" />
        </button>
      </div>

      {/* Subtle Perforated Stationery Seam */}
      <div
        aria-hidden="true"
        className="h-[2px] w-full shrink-0 border-b border-dashed border-[#c7a03c]/45 bg-[#f7f2df]"
      />

      {/* Ruled Warm Paper Writing Area */}
      <div className="relative flex min-h-0 flex-1 flex-col bg-[#fcfaf2]">
        <textarea
          value={note}
          onChange={(e) => onChangeNote(e.target.value)}
          placeholder="Jot down a quick thought..."
          aria-label="Quick desktop memo"
          className="min-h-0 w-full flex-1 resize-none bg-transparent px-3.5 py-2 text-[12.5px] font-normal leading-[22px] text-[#26221c] placeholder:text-[#9c927d] outline-none selection:bg-[#f6c844]/40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(transparent, transparent 21px, rgba(138, 114, 62, 0.12) 21px, rgba(138, 114, 62, 0.12) 22px)',
            backgroundAttachment: 'local',
          }}
        />

        {/* Quiet Paper Footer */}
        <div className="flex shrink-0 items-center justify-between px-3.5 pb-2 pt-0.5 text-[9.5px] font-medium text-[#8a806b] tabular-nums">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#30a14e]" />
            <span>Synced with Notes</span>
          </span>
          <span>{note.length} chars</span>
        </div>
      </div>
    </div>
  );
});
