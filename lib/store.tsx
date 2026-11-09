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
    return [...byId.values()].sort((a, b) => {
      const da = `${a.date} ${a.time}`;
      const db = `${b.date} ${b.time}`;
      return da.localeCompare(db);
    });
  }, [created]);

  const isJoined = useCallback((id: string) => joinedIds.includes(id), [joinedIds]);

  const join = useCallback((id: string) => {
    setJoinedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const leave = useCallback((id: string) => {
    setJoinedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const createActivity = useCallback((input: NewActivityInput): Activity => {
    const activity: Activity = {
      ...input,
      id: `user-${Date.now()}`,
      host: { name: YOU, initials: 'YO' },
      attendees: [],
      createdByMe: true,
    };
    setCreated((prev) => [...prev, activity]);
    setJoinedIds((prev) => [...prev, activity.id]);
    return activity;
  }, []);

  const value = useMemo<ActivitiesContextValue>(
    () => ({ activities, joinedIds, loaded, isJoined, join, leave, createActivity }),
    [activities, joinedIds, loaded, isJoined, join, leave, createActivity],
  );

  return <ActivitiesContext.Provider value={value}>{children}</ActivitiesContext.Provider>;
}

export function useActivities(): ActivitiesContextValue {
  const ctx = useContext(ActivitiesContext);
  if (!ctx) throw new Error('useActivities must be used inside <ActivitiesProvider>');
  return ctx;
}

/** Human-friendly date, e.g. "Sat, Nov 14". */
export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
