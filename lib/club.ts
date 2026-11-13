import AsyncStorage from "@react-native-async-storage/async-storage";

export const PLACES = [
  {
    id: "courts",
    name: "North courts",
    x: 22,
    y: 24,
    note: "Meet by the benches",
  },
  {
    id: "library",
    name: "Reading room",
    x: 70,
    y: 31,
    note: "Meet at the big table",
  },
  {
    id: "snacks",
    name: "Night market",
    x: 42,
    y: 72,
    note: "Meet under the string lights",
  },
];
export const KINDS = ["Play", "Make", "Wander"] as const;
export type Kind = (typeof KINDS)[number];
export type HostedQuest = {
  id: string;
  title: string;
  host: string;
  kind: Kind;
  place: string;
  when: string;
  note: string;
  capacity: number;
  occupied: number;
  own: boolean;
};
export const DEMOS: HostedQuest[] = [
  {
    id: "demo-rally",
    title: "Bad at badminton club",
    host: "Mika",
    kind: "Play",
    place: "courts",
    when: "Demo evening · 6pm",
    note: "No ranking, no gear needed in this fictional plan. Come for one rally or stay for snacks.",
    capacity: 4,
    occupied: 2,
    own: false,
  },
  {
    id: "demo-zine",
    title: "Make a tiny terrible zine",
    host: "Jules",
    kind: "Make",
    place: "library",
    when: "Demo afternoon · 3pm",
    note: "One sheet of paper, one weird idea. Quiet company counts as company.",
    capacity: 5,
    occupied: 2,
    own: false,
  },
  {
    id: "demo-snack",
    title: "The very serious snack walk",
    host: "Ren",
    kind: "Wander",
    place: "snacks",
    when: "Demo evening · 8pm",
    note: "Pick a snack, walk one loop, rate it with unnecessary seriousness.",
    capacity: 3,
    occupied: 2,
    own: false,
  },
  {
    id: "demo-full",
    title: "One more round?",
    host: "Ash",
    kind: "Play",
    place: "library",
    when: "Demo evening · 7pm",
    note: "A full table, included so the capacity state can be tried honestly.",
    capacity: 4,
    occupied: 4,
    own: false,
  },
];
export type ClubState = { version: 1; hosted: HostedQuest[]; joined: string[] };
const KEY = "jobless.club.v1";
export const emptyClub = (): ClubState => ({
  version: 1,
  hosted: [],
  joined: [],
});
export function validatePlan(p: {
  title: string;
  kind: string;
  place: string;
  when: string;
  note: string;
  capacity: number;
}): string | null {
  if (p.title.trim().length < 3 || p.title.length > 70)
    return "Give the quest a title between 3 and 70 characters.";
  if (!KINDS.includes(p.kind as Kind)) return "Choose a quest type.";
  if (!PLACES.some((x) => x.id === p.place))
    return "Choose one of the sample meeting places.";
  if (!p.when.trim() || p.when.length > 60)
    return "Add a time or meeting note (up to 60 characters).";
  if (!p.note.trim() || p.note.length > 400)
    return "Tell newcomers what to expect (up to 400 characters).";
  if (!Number.isInteger(p.capacity) || p.capacity < 2 || p.capacity > 12)
    return "Choose 2 to 12 total spots, including you.";
  return null;
}
function validHosted(value: unknown): value is HostedQuest {
  if (!value || typeof value !== "object") return false;
  const p = value as HostedQuest;
  return (
    typeof p.id === "string" &&
    p.id.startsWith("local-") &&
    p.host === "You" &&
    p.own === true &&
    p.occupied === 1 &&
    typeof p.title === "string" &&
    typeof p.kind === "string" &&
    typeof p.place === "string" &&
    typeof p.when === "string" &&
    typeof p.note === "string" &&
    !validatePlan(p)
  );
}
/** Invalid storage is surfaced, never silently overwritten. No network is involved. */
export async function readClub(): Promise<ClubState> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return emptyClub();
  const p = JSON.parse(raw) as ClubState;
  if (
    !p ||
    p.version !== 1 ||
    !Array.isArray(p.hosted) ||
    !Array.isArray(p.joined) ||
    !p.hosted.every(validHosted) ||
    !p.joined.every(
      (id) =>
        typeof id === "string" &&
        DEMOS.some((q) => q.id === id && q.occupied < q.capacity),
    ) ||
    new Set(p.hosted.map((q) => q.id)).size !== p.hosted.length ||
    new Set(p.joined).size !== p.joined.length
  )
    throw new Error("Unreadable club data");
  return p;
}
export async function writeClub(state: ClubState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
