import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'jobless.savedQuests.v1';

export interface SavedQuest {
  id: string;
  name: string;
  destination: string;
  createdAt: number;
}

function isSavedQuest(value: unknown): value is SavedQuest {
  if (typeof value !== 'object' || value === null) return false;
  const q = value as Record<string, unknown>;
  return (
    typeof q.id === 'string' &&
    typeof q.name === 'string' &&
    typeof q.destination === 'string' &&
    typeof q.createdAt === 'number'
  );
}

/** Reads saved quests. Corrupt or malformed entries are dropped, never trusted. */
export async function listSavedQuests(): Promise<SavedQuest[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedQuest);
  } catch {
    return [];
  }
}

/** Persists a quest on this device. Throws if storage fails. */
export async function saveQuest(name: string, destination: string): Promise<SavedQuest> {
  const quest: SavedQuest = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    destination,
    createdAt: Date.now(),
  };
  const existing = await listSavedQuests();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([quest, ...existing]));
  return quest;
}

export async function removeQuest(id: string): Promise<void> {
  const existing = await listSavedQuests();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing.filter((q) => q.id !== id)));
}
