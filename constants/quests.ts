export interface Quest {
  /** Activity name, also used as the route param. */
  name: string;
  /** Sticker accent color. */
  accent: string;
  /** Field-guide index, e.g. "01". */
  index: string;
  blurb: string;
}

export const QUESTS: Quest[] = [
  {
    name: 'Volleyball',
    accent: '#4FA8E8',
    index: '01',
    blurb: 'Six on the sand or two against the wall. Games run on whoever shows up.',
  },
  {
    name: 'Grocery Shopping',
    accent: '#3D9B5F',
    index: '02',
    blurb: 'A cart, a list, and someone to split the snack aisle with.',
  },
  {
    name: 'Exploring',
    accent: '#E8A90C',
    index: '03',
    blurb: 'Pick a direction, not a plan. The point is the detour.',
  },
  {
    name: 'Food',
    accent: '#E8552F',
    index: '04',
    blurb: 'New spot or the late-night usual. Eating alone is the actual bug.',
  },
  {
    name: 'Studying',
    accent: '#9B7FD4',
    index: '05',
    blurb: 'Body doubling for the deadline. Bring your own problem set.',
  },
];
