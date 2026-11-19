export interface WibTimeParts {
  hour: number;
  minute: number;
  second: number;
  isDaytime: boolean;
  timeHm: string;
  secondsStr: string;
  dateLabel: string;
}

export function getWibTimeParts(date: Date): WibTimeParts {
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

export function isClockDaytime(date: Date): boolean {
  return getWibTimeParts(date).isDaytime;
}
