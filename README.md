# Jobless

A side-quest social club prototype. The original hook is meeting people through small hosted activities, not managing an existing friend group.

## Try the current prototype

```sh
npm ci
npx expo start
```

Home's **Find side-quest people** opens `/club`:

- Four fictional hosted quests with different hosts, types, times and capacity states.
- Three imaginary campus places on an interactive schematic board. Markers and named controls filter the same quest list. This is not GPS, a street map or navigation.
- Filter Play / Make / Wander, open a host's quest, inspect a full quest, join locally, leave, and find the RSVP in My plans after reload.
- Host a quest with a title, type, sample place, meeting note, newcomer note and 2-12 total spots. Validation runs before storage. A confirmed save opens its detail; My plans can delete it.
- Fictional hosts, places and occupancy are labeled. No real users, shared attendance, messages, bookings, invitations or notifications. A local RSVP does not contact anyone. Do not travel based on sample plans.
- Local data uses AsyncStorage (`jobless.club.v1`). Failed writes do not claim success or clear a draft. Unreadable data surfaces a retry state and is not overwritten. Clear site/app data manually to reset a corrupt store if retry cannot read it.

The Quests tab retains the original five starter activities and destination-saving flow separately. These are personal ideas, not hosted social quests. Its confirmation reads the actual local saved-record ID; missing/forged IDs and unknown activities do not claim a save.

## Structure

- `app/club.tsx`: discovery, place board, detail, local hosting and RSVP views.
- `lib/club.ts`: fictional fixtures, validation, versioned local storage.
- `app/(tabs)/`: home and legacy starter-quest board/detail.
- `app/quest.tsx`, `lib/savedQuests.ts`: starter-save confirmation and storage.
- `components/`, `constants/`: field-guide theme, paper cards, themed text/buttons.
- `assets/fonts/`: bundled Space Grotesk and Space Mono with license/provenance.

## Checks

```sh
npx tsc --noEmit
npx jest --runInBand --watchAll=false
npx expo export --platform web
node scripts/e2e-club.mjs
node scripts/e2e-web.mjs
```

The browser scripts use `puppeteer-core` and an installed Chrome. Set `CHROME_PATH` if it is not at `/usr/bin/google-chrome`. They serve the exported output locally on ports 8411 and 8410. Screenshots are written to `test-results/`.

`e2e-club` checks type/place filters, selected/full state, local join/leave and reload, empty My plans, host validation/save/reload/delete, blocked writes, corrupt storage without overwrite, mobile/desktop/dark rendering and no page errors/overflow. `e2e-web` checks the retained starter-save flow, persistence/removal and invalid routes. These are Chromium web checks, not native-device or screen-reader certification.

## Limits and review choices

This is an inspectable local product loop, not a working multi-user social service. Real accounts, discovery, geospatial data, shared capacity, moderation, privacy controls and live coordination remain unbuilt. Sample data is not live availability. The schematic intentionally requests no location permission or external map tiles. `react-native-maps`, `expo-location` and unused Expo template components remain; this revision does not claim they were removed. No dependency changes are needed for the new loop.

There has been no physical iOS/Android run, Safari/Firefox run, assistive-technology audit, merge or deployment. Upstream dependency audit findings remain unresolved. Review the prototype on its own merits; a visual redesign is not evidence of demand or startup readiness.
