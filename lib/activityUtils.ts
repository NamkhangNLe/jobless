import type { Activity } from '@/models/Activity';

/**
 * Pure helpers for activities: date/time parsing, validation, counts, and
 * deterministic display offsets. No React Native imports, so this module
 * is unit-testable in plain Jest (see activityUtils.test.ts).
 */

/** Parse a 12-hour time like "6:30 PM" / "9:00 am". Returns null when malformed. */
export function parseTime12h(time: string): { hour24: number; minute: number } | null {
  const m = /^\s*(\d{1,2}):(\d{2})\s*([AaPp][Mm])\s*$/.exec(time);
  if (!m) return null;
  const hour12 = Number(m[1]);
  const minute = Number(m[2]);
  if (hour12 < 1 || hour12 > 12 || minute < 0 || minute > 59) return null;
  const ampm = m[3].toUpperCase();
  const hour24 = ampm === 'PM' ? (hour12 % 12) + 12 : hour12 % 12;
  return { hour24, minute };
}

/** True for a real calendar date in YYYY-MM-DD form (rejects 2026-02-30 etc.). */
export function isValidIsoDate(date: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return false;
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
}

/** True for a 12-hour time like "6:30 PM". */
export function isValidTime12h(time: string): boolean {
  return parseTime12h(time) !== null;
}

/**
 * Parse an activity's date + 12-hour time into a real Date (local time).
 * Returns null for anything malformed — callers must never render the
 * result of `new Date(garbage)` ("Invalid Date").
 */
export function parseActivityDateTime(date: string, time: string): Date | null {
  if (!isValidIsoDate(date)) return null;
  const t = parseTime12h(time);
  if (!t) return null;
  const [y, mo, d] = date.split('-').map(Number);
  return new Date(y, mo - 1, d, t.hour24, t.minute, 0, 0);
}

/** Sort key: milliseconds since epoch; invalid dates sort last. */
export function activityTimestamp(activity: Activity): number {
  return parseActivityDateTime(activity.date, activity.time)?.getTime() ?? Number.POSITIVE_INFINITY;
}

/** "6:30 PM" from 24-hour parts. */
export function formatTime12h(hour24: number, minute: number): string {
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, '0')} ${ampm}`;
}

/**
 * Human-friendly date, e.g. "Sat, Nov 14". Never returns "Invalid Date":
 * malformed input renders as "Date to be set".
 */
export function formatDateSafe(iso: string): string {
  if (!isValidIsoDate(iso)) return 'Date to be set';
  const [y, mo, d] = iso.split('-').map(Number);
  const dt = new Date(y, mo - 1, d, 12, 0, 0, 0);
  return dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

/**
 * How many people are in the quest's listed crew, counting the viewer when
 * they joined. The seed attendees are a listed crew, not live RSVPs —
 * callers must label the number as crew, not as people who confirmed.
 */
export function goingCount(activity: Activity, joined: boolean): number {
  return activity.attendees.length + (joined ? 1 : 0);
}

export function spotsLeftFor(activity: Activity, joined: boolean): number {
  return Math.max(0, activity.spotsTotal - goingCount(activity, joined));
}

export function isFullFor(activity: Activity, joined: boolean): boolean {
  return spotsLeftFor(activity, joined) <= 0;
}

/**
 * Deterministic per-activity pin offset, ±0.0004° (~±40 m). Two activities
 * at the exact same coordinate never stack exactly on the map, but a real
 * location still renders at essentially its true spot, and the offset is
 * stable across renders.
 */
export function pinOffsetFor(id: string): { dLat: number; dLng: number } {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const dLat = (((h % 1000) / 1000) - 0.5) * 0.0008;
  const dLng = ((((h >> 7) % 1000) / 1000) - 0.5) * 0.0008;
  return { dLat, dLng };
}

/** Editorial avatar palette — one stable color per person, hashed from name. */
const AVATAR_COLORS = [
  '#2E7D9A',
  '#3D8B4F',
  '#C96A2B',
  '#5B5BD6',
  '#D6336C',
  '#7D5BA6',
  '#00897B',
  '#B7791F',
];

export function avatarColorFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
