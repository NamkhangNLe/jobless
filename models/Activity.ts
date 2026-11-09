export type ActivityCategory =
  | 'Sports'
  | 'Outdoors'
  | 'Food'
  | 'Study'
  | 'Social'
  | 'Creative'
  | 'Fitness'
  | 'Tech';

export const CATEGORIES: ActivityCategory[] = [
  'Sports',
  'Outdoors',
  'Food',
  'Study',
  'Social',
  'Creative',
  'Fitness',
  'Tech',
];

export interface ActivityHost {
  name: string;
  initials: string;
}

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  description: string;
  /** ISO date string, e.g. "2026-11-10" */
  date: string;
  /** Display time, e.g. "6:30 PM" */
  time: string;
  place: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  host: ActivityHost;
  spotsTotal: number;
  /** Names of people already going (not counting the viewer) */
  attendees: string[];
  tags: string[];
  /** True when the activity was created by the current user */
  createdByMe?: boolean;
}

/**
 * Spots left in the quest's listed crew, counting the viewer when joined.
 * The seed attendees are a listed crew, not live RSVPs — callers must label
 * the number as crew. `joined` defaults to false for callers that do not
 * know the viewer's join state.
 */
export function spotsLeft(activity: Activity, joined = false): number {
  return Math.max(0, activity.spotsTotal - activity.attendees.length - (joined ? 1 : 0));
}

export function isFull(activity: Activity, joined = false): boolean {
  return spotsLeft(activity, joined) <= 0;
}
