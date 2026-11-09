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

export function spotsLeft(activity: Activity): number {
  return Math.max(0, activity.spotsTotal - activity.attendees.length);
}

export function isFull(activity: Activity): boolean {
  return spotsLeft(activity) <= 0;
}
