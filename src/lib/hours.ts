/**
 * Trading hours exactly as published on mbbarbershop.com.au, plus a live
 * open/closed readout computed in the shop's own timezone (Brisbane never
 * observes daylight saving, but we let Intl handle that rather than assume).
 */

export type Day = {
  /** JS getDay() index: 0 = Sunday. */
  index: number;
  label: string;
  short: string;
  /** Minutes from midnight, or null when closed all day. */
  open: number | null;
  close: number | null;
};

const h = (hour: number, minute = 0) => hour * 60 + minute;

export const TRADING_HOURS: Day[] = [
  { index: 1, label: 'Monday', short: 'Mon', open: h(9), close: h(18) },
  { index: 2, label: 'Tuesday', short: 'Tue', open: h(9), close: h(18) },
  { index: 3, label: 'Wednesday', short: 'Wed', open: h(9), close: h(19) },
  { index: 4, label: 'Thursday', short: 'Thu', open: h(9), close: h(19) },
  { index: 5, label: 'Friday', short: 'Fri', open: h(9), close: h(19) },
  { index: 6, label: 'Saturday', short: 'Sat', open: h(9), close: h(16) },
  { index: 0, label: 'Sunday', short: 'Sun', open: null, close: null },
];

const TIMEZONE = 'Australia/Brisbane';

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Current weekday index and minutes-from-midnight in the shop's timezone. */
export function shopLocalTime(now: Date = new Date()): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: TIMEZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  const day = WEEKDAY_INDEX[get('weekday')] ?? now.getDay();
  // Intl can emit "24" for midnight in hour12:false — normalise it.
  const hour = Number(get('hour')) % 24;
  const minutes = hour * 60 + Number(get('minute'));

  return { day, minutes };
}

export function formatMinutes(minutes: number): string {
  const hour24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hour24 >= 12 ? 'pm' : 'am';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return mins === 0 ? `${hour12}${suffix}` : `${hour12}:${String(mins).padStart(2, '0')}${suffix}`;
}

export type OpenState = {
  isOpen: boolean;
  /** Short status for the nav pill, e.g. "Open till 7pm" or "Opens Mon 9am". */
  label: string;
  /** getDay() index of today in the shop's timezone. */
  todayIndex: number;
};

export function getOpenState(now: Date = new Date()): OpenState {
  const { day, minutes } = shopLocalTime(now);
  const today = TRADING_HOURS.find((d) => d.index === day);

  if (today && today.open !== null && today.close !== null) {
    if (minutes < today.open) {
      return { isOpen: false, label: `Opens ${formatMinutes(today.open)}`, todayIndex: day };
    }
    if (minutes < today.close) {
      return { isOpen: true, label: `Open till ${formatMinutes(today.close)}`, todayIndex: day };
    }
  }

  // Walk forward to the next day that actually trades.
  for (let step = 1; step <= 7; step += 1) {
    const nextIndex = (day + step) % 7;
    const next = TRADING_HOURS.find((d) => d.index === nextIndex);
    if (next && next.open !== null) {
      const when = step === 1 ? 'tomorrow' : next.short;
      return {
        isOpen: false,
        label: `Opens ${when} ${formatMinutes(next.open)}`,
        todayIndex: day,
      };
    }
  }

  return { isOpen: false, label: 'Closed', todayIndex: day };
}
