import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ClockWidgetProps {
  now: Date;
  availability: string;
  size: { width: number; height: number };
}

function getWibParts(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
  const second = Number(parts.find((p) => p.type === 'second')?.value ?? '0');

  const dateLabel = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
  });

  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  const ss = String(second).padStart(2, '0');

  return {
    hour,
    minute,
    second,
    isDaytime: hour >= 6 && hour < 18,
    timeHm: `${hh}:${mm}`,
    secondsStr: ss,
    dateLabel,
  };
}

function isClockDaytime(now: Date): boolean {
  return getWibParts(now).isDaytime;
}

export function ClockWidget({ now, availability, size }: ClockWidgetProps) {
  const [preferDigital, setPreferDigital] = useState(false);

  const { hour, minute, second, isDaytime, timeHm, secondsStr, dateLabel } =
    getWibParts(now);

  const isWide = size.width >= 236;
  const isCompact = size.width < 176 || size.height < 176;

  // Classic horological angles
  const secondDeg = second * 6;
  const minuteDeg = minute * 6 + second * 0.1;
  const hourDeg = (hour % 12) * 30 + minute * 0.5;

  const dialSize = isWide
    ? Math.min(size.height - 24, Math.round(size.width * 0.48), 146)
    : Math.min(size.width - 20, size.height - 20, 196);

  const showAllNumerals = dialSize >= 132;

  const dialBg = isDaytime ? '#ffffff' : '#121316';
  const tickMajor = isDaytime ? '#1d1d1f' : '#f5f5f7';
  const tickMinor = isDaytime
    ? 'rgba(29,29,31,0.22)'
    : 'rgba(255,255,255,0.22)';
  const numeralColor = isDaytime ? '#1d1d1f' : '#f5f5f7';
  const subLabelColor = isDaytime
    ? 'rgba(29,29,31,0.45)'
    : 'rgba(255,255,255,0.45)';
  const handColor = isDaytime ? '#1d1d1f' : '#f5f5f7';

  const renderAnalogDial = () => (
    <svg
      width={dialSize}
      height={dialSize}
      viewBox="0 0 160 160"
      aria-hidden="true"
      className="shrink-0 overflow-visible"
    >
      {/* Recessed watch dial */}
      <circle
        cx="80"
        cy="80"
        r="74"
        fill={dialBg}
        stroke={isDaytime ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}
        strokeWidth="1"
      />

      {/* 60 minute ticks */}
      {Array.from({ length: 60 }).map((_, idx) => {
        const isHourMark = idx % 5 === 0;
        return (
          <line
            key={idx}
            x1="80"
            y1={isHourMark ? 11 : 12.5}
            x2="80"
            y2={isHourMark ? 18 : 16}
            stroke={isHourMark ? tickMajor : tickMinor}
            strokeWidth={isHourMark ? 1.8 : 0.9}
            strokeLinecap="round"
            transform={`rotate(${idx * 6} 80 80)`}
          />
        );
      })}

      {/* Numerals */}
      {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, idx) => {
        if (!showAllNumerals && num % 3 !== 0) return null;
        const angleRad = ((idx * 30 - 90) * Math.PI) / 180;
        const radius = showAllNumerals ? 52 : 53;
        const x = 80 + Math.cos(angleRad) * radius;
        const y = 80 + Math.sin(angleRad) * radius;
        return (
          <text
            key={num}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={numeralColor}
            fontSize={showAllNumerals ? '12.5' : '15'}
            fontWeight="600"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {num}
          </text>
        );
      })}

      {/* Engraved Apple World Clock city & zone */}
      <text
        x="80"
        y="53"
        textAnchor="middle"
        fill={subLabelColor}
        fontSize="8.5"
        fontWeight="700"
        letterSpacing="0.12em"
      >
        SMG
      </text>
      <text
        x="80"
        y="108"
        textAnchor="middle"
        fill={subLabelColor}
        fontSize="7.5"
        fontWeight="600"
        letterSpacing="0.08em"
      >
        WIB
      </text>

      {/* Hour hand */}
      <g transform={`rotate(${hourDeg} 80 80)`}>
        <line
          x1="80"
          y1="80"
          x2="80"
          y2="46"
          stroke={handColor}
          strokeWidth="3.8"
          strokeLinecap="round"
        />
      </g>

      {/* Minute hand */}
      <g transform={`rotate(${minuteDeg} 80 80)`}>
        <line
          x1="80"
          y1="80"
          x2="80"
          y2="29"
          stroke={handColor}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </g>

      {/* Center cap under second hand */}
      <circle cx="80" cy="80" r="3.6" fill={handColor} />

      {/* Apple Orange Second Hand with counterbalance */}
      <g transform={`rotate(${secondDeg} 80 80)`}>
        <line
          x1="80"
          y1="95"
          x2="80"
          y2="23"
          stroke="#ff9500"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="80" cy="80" r="2.4" fill="#ff9500" />
        <circle cx="80" cy="80" r="1" fill={dialBg} />
      </g>
    </svg>
  );

  return (
    <div
      className={cn(
        'relative flex h-full w-full overflow-hidden select-none transition-colors duration-300',
        isDaytime
          ? 'bg-[#f2f2f5]/[0.94] text-[#1d1d1f]'
          : 'bg-[#1b1c20]/[0.94] text-[#f5f5f7]',
        'backdrop-blur-2xl backdrop-saturate-150'
      )}
    >
      {/* Top specular highlight */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent to-transparent',
          isDaytime ? 'via-white/90' : 'via-white/20'
        )}
      />

      {isWide ? (
        /* Wide Horological Split: Analog Dial + Digital Semarang Telemetry */
        <div className="relative z-10 flex h-full w-full items-center justify-between gap-3 px-4 py-3">
          {renderAnalogDial()}

          <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-1.5">
            <div>
              <div className="text-[12px] font-semibold tracking-[-0.01em]">
                Semarang
              </div>
              <div
                className={cn(
                  'text-[10.5px]',
                  isDaytime ? 'text-black/50' : 'text-white/50'
                )}
              >
                {dateLabel} · UTC+7
              </div>
            </div>

            <div className="flex items-baseline gap-0.5 tabular-nums">
              <span className="text-[28px] font-semibold leading-none tracking-[-0.04em]">
                {timeHm}
              </span>
              <span
                className={cn(
                  'text-[13px] font-medium',
                  isDaytime ? 'text-black/40' : 'text-white/40'
                )}
              >
                :{secondsStr}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#30d158]" />
              <span
                className={cn(
                  'truncate text-[10px] font-medium',
                  isDaytime ? 'text-black/65' : 'text-white/70'
                )}
              >
                {availability}
              </span>
            </div>
          </div>
        </div>
      ) : preferDigital ? (
        /* Compact Digital Face (tap to flip back to analog dial) */
        <button
          type="button"
          onClick={() => setPreferDigital(false)}
          title="Click for analog clock face"
          aria-label={`Semarang time ${timeHm}:${secondsStr} WIB. Click for analog clock.`}
          className="relative z-10 flex h-full w-full flex-col justify-between p-3.5 text-left transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold tracking-[-0.01em]">
              Semarang
            </span>
            <span
              className={cn(
                'text-[10px] font-medium tabular-nums',
                isDaytime ? 'text-black/45' : 'text-white/45'
              )}
            >
              UTC+7
            </span>
          </div>

          <div className="my-auto">
            <div className="flex items-baseline gap-0.5 tabular-nums">
              <span
                className={cn(
                  'font-semibold leading-none tracking-[-0.045em]',
                  isCompact ? 'text-[34px]' : 'text-[40px]'
                )}
              >
                {timeHm}
              </span>
              <span className="text-[14px] font-semibold text-[#ff9500]">
                :{secondsStr}
              </span>
            </div>
            <div
              className={cn(
                'mt-1.5 text-[11px] font-medium',
                isDaytime ? 'text-black/55' : 'text-white/55'
              )}
            >
              {dateLabel}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#30d158]" />
            <span
              className={cn(
                'truncate text-[10px] font-medium',
                isDaytime ? 'text-black/65' : 'text-white/65'
              )}
            >
              {availability}
            </span>
          </div>
        </button>
      ) : (
        /* Compact Signature Analog Watch Face (tap to peek digital) */
        <button
          type="button"
          onClick={() => setPreferDigital(true)}
          title={`Semarang ${timeHm}:${secondsStr} WIB — Click for digital readout`}
          aria-label={`Semarang analog clock showing ${timeHm} WIB. Click for digital readout.`}
          className="relative z-10 flex h-full w-full items-center justify-center p-2.5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]"
        >
          {renderAnalogDial()}
        </button>
      )}
    </div>
  );
}
