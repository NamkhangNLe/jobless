import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Activity } from '@/models/Activity';
import { isFull } from '@/models/Activity';
import { activityTimestamp, formatDateSafe } from '@/lib/activityUtils';
import { getSeedActivities } from '@/data/seedActivities';

const CREATED_KEY = '@jobless/created-activities-v1';
const JOINED_KEY = '@jobless/joined-ids-v1';

export interface NewActivityInput {
  title: string;
  category: Activity['category'];
  description: string;
  date: string;
  time: string;
  place: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  spotsTotal: number;
  tags: string[];
}

interface ActivitiesContextValue {
  activities: Activity[];
  joinedIds: string[];
  loaded: boolean;
  isJoined: (id: string) => boolean;
  join: (id: string) => void;
  leave: (id: string) => void;
  createActivity: (input: NewActivityInput) => Activity;
  /** Delete a quest created by the current user. No-op for anything else. */
  deleteActivity: (id: string) => void;
}

const ActivitiesContext = createContext<ActivitiesContextValue | null>(null);

const YOU = 'You';

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const [created, setCreated] = useState<Activity[]>([]);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [createdRaw, joinedRaw] = await Promise.all([
          AsyncStorage.getItem(CREATED_KEY),
          AsyncStorage.getItem(JOINED_KEY),
        ]);
        if (createdRaw) setCreated(JSON.parse(createdRaw) as Activity[]);
        if (joinedRaw) setJoinedIds(JSON.parse(joinedRaw) as string[]);
      } catch {
        // Storage unavailable (e.g. private mode): run in-memory.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(CREATED_KEY, JSON.stringify(created)).catch(() => {});
  }, [created, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(JOINED_KEY, JSON.stringify(joinedIds)).catch(() => {});
  }, [joinedIds, loaded]);

  const activities = useMemo<Activity[]>(() => {
    const seed = getSeedActivities();
    const byId = new Map<string, Activity>();
    seed.forEach((a) => byId.set(a.id, a));
    created.forEach((a) => byId.set(a.id, a));
    // Sort by real parsed datetime. The old string sort on
    // `${date} ${time}` put "6:30 PM" before "9:00 AM" on the same day.
    return [...byId.values()].sort((a, b) => activityTimestamp(a) - activityTimestamp(b));
  }, [created]);

  const isJoined = useCallback((id: string) => joinedIds.includes(id), [joinedIds]);

  const join = useCallback(
    (id: string) => {
      setJoinedIds((prev) => {
        if (prev.includes(id)) return prev;
        // A full quest cannot be joined: joining consumes a spot, so check
        // capacity without counting the viewer yet.
        const target = activities.find((a) => a.id === id);
        if (target && isFull(target, false)) return prev;
        return [...prev, id];
      });
    },
    [activities],
  );

  const leave = useCallback((id: string) => {
    setJoinedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setCreated((prev) => {
      if (!prev.some((a) => a.id === id)) return prev;
      return prev.filter((a) => a.id !== id);
    });
    setJoinedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const createActivity = useCallback((input: NewActivityInput): Activity => {
    const activity: Activity = {
      ...input,
      id: `user-${Date.now()}`,
      host: { name: YOU, initials: 'YU' },
      attendees: [],
      createdByMe: true,
    };
    setCreated((prev) => [...prev, activity]);
    setJoinedIds((prev) => [...prev, activity.id]);
    return activity;
  }, []);

  const value = useMemo<ActivitiesContextValue>(
    () => ({
      activities,
      joinedIds,
      loaded,
      isJoined,
      join,
      leave,
      createActivity,
      deleteActivity,
    }),
    [activities, joinedIds, loaded, isJoined, join, leave, createActivity, deleteActivity],
  );

  return <ActivitiesContext.Provider value={value}>{children}</ActivitiesContext.Provider>;
}

export function useActivities(): ActivitiesContextValue {
  const ctx = useContext(ActivitiesContext);
  if (!ctx) throw new Error('useActivities must be used inside <ActivitiesProvider>');
  return ctx;
}

/** Human-friendly date, e.g. "Sat, Nov 14". Never renders "Invalid Date". */
export function formatDate(iso: string): string {
  return formatDateSafe(iso);
}
