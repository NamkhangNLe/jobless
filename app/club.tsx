import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { ThemedText as Text } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StickerCard } from "@/components/StickerCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  ClubState,
  DEMOS,
  HostedQuest,
  Kind,
  KINDS,
  PLACES,
  readClub,
  validatePlan,
  writeClub,
} from "@/lib/club";

/** Fictional discovery sandbox: no names here represent live hosts or availability. */
export default function Club() {
  const ink = useThemeColor({}, "text");
  const muted = useThemeColor({}, "textMuted");
  const paper = useThemeColor({}, "card");
  const line = useThemeColor({}, "border");
  const [state, setState] = React.useState<ClubState | null>(null);
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [filter, setFilter] = React.useState("All");
  const [place, setPlace] = React.useState("All");
  const [mode, setMode] = React.useState<"discover" | "mine" | "create">(
    "discover",
  );
  const [selected, select] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("");
  const [kind, setKind] = React.useState<Kind>("Play");
  const [location, setLocation] = React.useState(PLACES[0].id);
  const [when, setWhen] = React.useState("");
  const [note, setNote] = React.useState("");
  const [capacity, setCapacity] = React.useState("4");
  const [notice, setNotice] = React.useState("");
  const load = React.useCallback(async () => {
    setError("");
    try {
      setState(await readClub());
    } catch {
      setError(
        "Could not read local club data. Nothing has been changed. Retry after checking storage.",
      );
    }
  }, []);
  React.useEffect(() => {
    void load();
  }, [load]);
  const save = async (next: ClubState, message: string) => {
    if (busy) return false;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await writeClub(next);
      setState(next);
      setNotice(message);
      return true;
    } catch {
      setError(
        "Could not save on this device. Nothing was confirmed. Please retry.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  };
  const action = (
    label: string,
    onPress: () => void,
    active = false,
    disabled = false,
  ) => (
    <Pressable
      key={label}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        s.button,
        {
          borderColor: line,
          backgroundColor: active ? "#FFC21C" : paper,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <Text type="kicker" style={{ color: active ? "#17150F" : ink }}>
        {label}
      </Text>
    </Pressable>
  );
  const field = (
    label: string,
    value: string,
    onChangeText: (v: string) => void,
    maxLength: number,
    multiline = false,
  ) => (
    <View style={s.gap}>
      <Text type="kicker">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        multiline={multiline}
        style={[
          s.input,
          {
            color: ink,
            backgroundColor: paper,
            borderColor: line,
            minHeight: multiline ? 100 : 48,
          },
        ]}
      />
    </View>
  );
  const all = [...(state?.hosted ?? []), ...DEMOS];
  const visible = all.filter(
    (q) =>
      (filter === "All" || q.kind === filter) &&
      (place === "All" || q.place === place) &&
      (mode !== "mine" || q.own || state?.joined.includes(q.id)),
  );
  const detail = all.find((q) => q.id === selected);
  const card = (q: HostedQuest) => {
    const joined = state?.joined.includes(q.id) ?? false;
    const count = q.occupied + (joined ? 1 : 0);
    return (
      <Pressable
        key={q.id}
        accessibilityRole="button"
        accessibilityLabel={`Open ${q.title}`}
        onPress={() => select(q.id)}
      >
        <StickerCard style={s.gap}>
          <View style={s.row}>
            <Text type="kicker" style={{ color: muted }}>
              {q.kind} · {q.own ? "Your local plan" : "Fictional demo host"}
            </Text>
            <Text type="kicker">
              {count}/{q.capacity}
            </Text>
          </View>
          <Text type="title">{q.title}</Text>
          <Text style={{ color: muted }}>
            {q.host} · {PLACES.find((p) => p.id === q.place)?.name}
          </Text>
          <Text>{q.when}</Text>
          <Text type="kicker">
            {joined
              ? "Joined locally · open →"
              : count >= q.capacity
                ? "Full · view details →"
                : "Meet the host →"}
          </Text>
        </StickerCard>
      </Pressable>
    );
  };
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={s.page}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.row}>
          {action("← Home", () => router.replace("/"))}
          <Text type="kicker" style={{ color: muted }}>
            FIELD GUIDE / 002
          </Text>
        </View>
        <Text type="kicker" style={{ color: muted }}>
          Jobless · find your side-quest people
        </Text>
        <Text type="display">Strangers, then{"\n"}sidekicks.</Text>
        <Text style={{ color: muted }}>
          Try the people → place → plan loop. All hosts, places and availability
          below are fictional samples. Your actions stay on this device. No
          invitations, messages or real bookings.
        </Text>
        {error ? (
          <View accessibilityRole="alert" style={s.gap}>
            <Text>{error}</Text>
            {!state &&
              action("Retry loading", () => {
                void load();
              })}
          </View>
        ) : null}
        {notice ? (
          <Text accessibilityLiveRegion="polite" style={{ color: muted }}>
            {notice}
          </Text>
        ) : null}
        {!state ? (
          <Text>Local board not loaded.</Text>
        ) : (
          <>
            <View style={s.wrap}>
              {action(
                "Discover",
                () => {
                  setMode("discover");
                  select(null);
                },
                mode === "discover",
              )}
              {action(
                "My plans",
                () => {
                  setMode("mine");
                  select(null);
                  setFilter("All");
                  setPlace("All");
                },
                mode === "mine",
              )}
              {action(
                "Host a quest",
                () => {
                  setMode("create");
                  select(null);
                  setError("");
                },
                mode === "create",
              )}
            </View>
            {mode === "create" ? (
              <StickerCard style={s.gap}>
                <Text type="title">Leave room for someone new.</Text>
                <Text style={{ color: muted }}>
                  Create a local draft, visible only here. Hosting does not
                  publish it or contact anyone.
                </Text>
                {field("Quest title", title, setTitle, 70)}
                <Text type="kicker">Quest type</Text>
                <View style={s.wrap}>
                  {KINDS.map((k) => action(k, () => setKind(k), kind === k))}
                </View>
                <Text type="kicker">Sample meeting place</Text>
                <View style={s.wrap}>
                  {PLACES.map((p) =>
                    action(p.name, () => setLocation(p.id), location === p.id),
                  )}
                </View>
                {field("When to meet (local note)", when, setWhen, 60)}
                {field("What should newcomers know?", note, setNote, 400, true)}
                {field(
                  "Total spots, including you (2-12)",
                  capacity,
                  setCapacity,
                  2,
                )}
                {action(
                  busy ? "Saving…" : "Save local hosted quest",
                  () => {
                    const draft = {
                      title: title.trim(),
                      kind,
                      place: location,
                      when: when.trim(),
                      note: note.trim(),
                      capacity: Number(capacity),
                    };
                    setNotice("");
                    const invalid = validatePlan(draft);
                    if (invalid) {
                      setError(invalid);
                      return;
                    }
                    const q: HostedQuest = {
                      ...draft,
                      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                      host: "You",
                      occupied: 1,
                      own: true,
                    };
                    void save(
                      { ...state, hosted: [q, ...state.hosted] },
                      "Hosted quest saved on this device only.",
                    ).then((ok) => {
                      if (ok) {
                        setTitle("");
                        setWhen("");
                        setNote("");
                        setMode("mine");
                        select(q.id);
                      }
                    });
                  },
                  true,
                  busy,
                )}
                <Text style={{ color: muted }}>
                  After saving, your local plan opens for review. You can delete
                  it there.
                </Text>
              </StickerCard>
            ) : detail ? (
              <StickerCard style={s.gap}>
                {action("← Back to board", () => select(null))}
                <Text type="kicker">
                  {detail.own
                    ? "Your local hosted quest"
                    : `Fictional host · ${detail.host}`}
                </Text>
                <Text type="display">{detail.title}</Text>
                <Text>{detail.when}</Text>
                <Text type="subtitle">
                  {PLACES.find((p) => p.id === detail.place)?.name}
                </Text>
                <Text style={{ color: muted }}>
                  {PLACES.find((p) => p.id === detail.place)?.note} · sample
                  place, not navigation
                </Text>
                <Text>{detail.note}</Text>
                <Text>
                  {detail.occupied + (state.joined.includes(detail.id) ? 1 : 0)}{" "}
                  of {detail.capacity} spots filled{" "}
                  {detail.own
                    ? "(just you on this device)"
                    : "(fictional sample + your local RSVP)"}
                </Text>
                {detail.own
                  ? action(
                      "Delete local hosted quest",
                      () => {
                        void save(
                          {
                            ...state,
                            hosted: state.hosted.filter(
                              (q) => q.id !== detail.id,
                            ),
                          },
                          "Local hosted quest deleted.",
                        ).then((ok) => {
                          if (ok) select(null);
                        });
                      },
                      false,
                      busy,
                    )
                  : state.joined.includes(detail.id)
                    ? action(
                        "Leave local plan",
                        () => {
                          void save(
                            {
                              ...state,
                              joined: state.joined.filter(
                                (id) => id !== detail.id,
                              ),
                            },
                            "Local RSVP removed. No one was contacted.",
                          );
                        },
                        false,
                        busy,
                      )
                    : action(
                        detail.occupied >= detail.capacity
                          ? "Full in this sample"
                          : "Join on this device",
                        () => {
                          void save(
                            { ...state, joined: [...state.joined, detail.id] },
                            "Local RSVP saved. This did not notify the fictional host.",
                          );
                        },
                        true,
                        busy || detail.occupied >= detail.capacity,
                      )}
                <Text style={{ color: muted }}>
                  No live people, chat or shared attendance. Do not travel based
                  on a sample plan.
                </Text>
              </StickerCard>
            ) : (
              <>
                <View style={s.row}>
                  <Text type="title">
                    {mode === "mine"
                      ? "Your local plans"
                      : "The meeting ground"}
                  </Text>
                  <Text type="kicker">{visible.length} plans</Text>
                </View>
                <View style={s.wrap}>
                  {["All", ...KINDS].map((k) =>
                    action(k, () => setFilter(k), filter === k),
                  )}
                </View>
                <View
                  style={[s.map, { backgroundColor: paper, borderColor: line }]}
                >
                  <View style={[s.path, { backgroundColor: line }]} />
                  <View style={[s.crosspath, { backgroundColor: line }]} />
                  <Text type="kicker" style={[s.mapLabel, { color: muted }]}>
                    IMAGINARY CAMPUS · NOT TO SCALE
                  </Text>
                  {PLACES.map((p, i) => (
                    <Pressable
                      key={p.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Filter place ${p.name}`}
                      accessibilityState={{ selected: place === p.id }}
                      onPress={() => setPlace(place === p.id ? "All" : p.id)}
                      style={[
                        s.pin,
                        {
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          borderColor: line,
                          backgroundColor:
                            place === p.id ? "#E8552F" : "#FFC21C",
                        },
                      ]}
                    >
                      <Text type="subtitle" style={{ color: "#17150F" }}>
                        {i + 1}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={{ color: muted }}>
                  Schematic place board, not a street map. Select a marker to
                  filter plans.
                </Text>
                <View style={s.wrap}>
                  {action("All places", () => setPlace("All"), place === "All")}
                  {PLACES.map((p, i) =>
                    action(
                      `${i + 1} ${p.name}`,
                      () => setPlace(p.id),
                      place === p.id,
                    ),
                  )}
                </View>
                {visible.length ? (
                  visible.map(card)
                ) : (
                  <StickerCard>
                    <Text type="title">Room for a new quest.</Text>
                    <Text>
                      No matching local plans. Try another filter or host your
                      own.
                    </Text>
                  </StickerCard>
                )}
              </>
            )}
          </>
        )}
        <Text type="kicker" style={{ color: muted }}>
          No jobs required. No pretend social network either.
        </Text>
      </ScrollView>
    </ThemedView>
  );
}
const s = StyleSheet.create({
  page: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 80,
    gap: 20,
    maxWidth: 700,
    width: "100%",
    alignSelf: "center",
  },
  gap: { gap: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    flexWrap: "wrap",
  },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  button: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 44,
  },
  input: { borderWidth: 2, borderRadius: 8, padding: 12, fontSize: 16 },
  map: { height: 240, borderWidth: 2, borderRadius: 16, overflow: "hidden" },
  mapLabel: { position: "absolute", bottom: 12, left: 14, fontSize: 10 },
  path: {
    width: "120%",
    height: 22,
    position: "absolute",
    top: 100,
    left: -15,
    transform: [{ rotate: "-16deg" }],
    opacity: 0.12,
  },
  crosspath: {
    height: 280,
    width: 18,
    position: "absolute",
    left: "55%",
    top: -20,
    transform: [{ rotate: "25deg" }],
    opacity: 0.12,
  },
  pin: {
    position: "absolute",
    width: 46,
    height: 46,
    borderWidth: 2,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -23,
    marginTop: -23,
  },
});
