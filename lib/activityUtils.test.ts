import {
  activityTimestamp,
  formatDateSafe,
  formatTime12h,
  isFullFor,
  isValidIsoDate,
  isValidTime12h,
  parseActivityDateTime,
  parseTime12h,
  pinOffsetFor,
  spotsLeftFor,
} from './activityUtils';
import type { Activity } from '@/models/Activity';

function activity(over: Partial<Activity> = {}): Activity {
  return {
    id: 'x',
    title: 'Test',
    category: 'Social',
    description: '',
    date: '2026-11-14',
    time: '6:30 PM',
    place: 'Somewhere',
    neighborhood: 'Midtown',
    latitude: 40.75,
    longitude: -73.98,
    host: { name: 'Maya', initials: 'MA' },
    spotsTotal: 8,
    attendees: ['A', 'B', 'C'],
    tags: [],
    ...over,
  };
}

describe('parseTime12h', () => {
  it('parses 12-hour times', () => {
    expect(parseTime12h('6:30 PM')).toEqual({ hour24: 18, minute: 30 });
    expect(parseTime12h('9:00 AM')).toEqual({ hour24: 9, minute: 0 });
    expect(parseTime12h('12:00 AM')).toEqual({ hour24: 0, minute: 0 });
    expect(parseTime12h('12:00 PM')).toEqual({ hour24: 12, minute: 0 });
    expect(parseTime12h('11:59 pm')).toEqual({ hour24: 23, minute: 59 });
  });
  it('rejects garbage', () => {
    expect(parseTime12h('')).toBeNull();
    expect(parseTime12h('18:30')).toBeNull();
    expect(parseTime12h('13:00 PM')).toBeNull();
    expect(parseTime12h('6:60 PM')).toBeNull();
    expect(parseTime12h('tomorrow')).toBeNull();
  });
});

describe('isValidIsoDate', () => {
  it('accepts real dates and rejects impossible ones', () => {
    expect(isValidIsoDate('2026-11-14')).toBe(true);
    expect(isValidIsoDate('2026-02-29')).toBe(false); // 2026 is not a leap year
    expect(isValidIsoDate('2024-02-29')).toBe(true);
    expect(isValidIsoDate('2026-13-01')).toBe(false);
    expect(isValidIsoDate('11/14/2026')).toBe(false);
    expect(isValidIsoDate('garbage')).toBe(false);
  });
});

describe('parseActivityDateTime + sort order', () => {
  it('sorts 6:30 PM after 9:00 AM on the same day (the old string sort got this backwards)', () => {
    const morning = activity({ date: '2026-11-14', time: '9:00 AM' });
    const evening = activity({ date: '2026-11-14', time: '6:30 PM' });
    expect(activityTimestamp(morning)).toBeLessThan(activityTimestamp(evening));
  });
  it('sorts by real datetime, not by string', () => {
    const list = [
      activity({ date: '2026-11-14', time: '6:30 PM' }),
      activity({ date: '2026-11-13', time: '11:00 PM' }),
      activity({ date: '2026-11-14', time: '9:00 AM' }),
    ];
    const sorted = [...list].sort((a, b) => activityTimestamp(a) - activityTimestamp(b));
    expect(sorted.map((a) => a.time)).toEqual(['11:00 PM', '9:00 AM', '6:30 PM']);
  });
  it('returns null for garbage and sorts it last', () => {
    expect(parseActivityDateTime('not-a-date', '6:30 PM')).toBeNull();
    expect(parseActivityDateTime('2026-11-14', 'whenever')).toBeNull();
    const bad = activity({ date: 'garbage', time: 'whenever' });
    expect(activityTimestamp(bad)).toBe(Number.POSITIVE_INFINITY);
  });
});

describe('formatDateSafe', () => {
  it('never renders "Invalid Date"', () => {
    expect(formatDateSafe('2026-11-14')).toMatch(/Nov 14/);
    expect(formatDateSafe('garbage')).toBe('Date to be set');
    expect(formatDateSafe('')).toBe('Date to be set');
    expect(formatDateSafe('2026-02-30')).toBe('Date to be set');
  });
});

describe('formatTime12h', () => {
  it('round-trips through parseTime12h', () => {
    for (const t of ['6:30 PM', '9:00 AM', '12:00 AM', '12:00 PM', '11:59 PM']) {
      const p = parseTime12h(t)!;
      expect(formatTime12h(p.hour24, p.minute)).toBe(t);
    }
  });
});

describe('spots / full accounting counts the join', () => {
  it('a join consumes a spot and can fill the quest', () => {
    const a = activity({ spotsTotal: 4, attendees: ['A', 'B', 'C'] });
    expect(spotsLeftFor(a, false)).toBe(1);
    expect(isFullFor(a, false)).toBe(false);
    expect(spotsLeftFor(a, true)).toBe(0);
    expect(isFullFor(a, true)).toBe(true);
  });
  it('never goes negative', () => {
    const a = activity({ spotsTotal: 2, attendees: ['A', 'B', 'C'] });
    expect(spotsLeftFor(a, true)).toBe(0);
  });
});

describe('validation helpers', () => {
  it('isValidTime12h gates the create form', () => {
    expect(isValidTime12h('6:30 PM')).toBe(true);
    expect(isValidTime12h('6:30')).toBe(false);
    expect(isValidTime12h('')).toBe(false);
  });
});

describe('pinOffsetFor', () => {
  it('is deterministic and small (under ~50 m)', () => {
    const a = pinOffsetFor('seed-volleyball');
    const b = pinOffsetFor('seed-volleyball');
    expect(a).toEqual(b);
    expect(Math.abs(a.dLat)).toBeLessThanOrEqual(0.0004);
    expect(Math.abs(a.dLng)).toBeLessThanOrEqual(0.0004);
  });
  it('separates two activities at the same coordinate', () => {
    expect(pinOffsetFor('a')).not.toEqual(pinOffsetFor('b'));
  });
});
