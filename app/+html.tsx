import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Custom HTML shell for the web export (expo-router `+html.tsx`).
 * This is what puts a real <title>, meta description, and theme-color into
 * the statically exported index.html — without it the export ships an empty
 * `<title data-rh="true"></title>` and no description.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Jobless — Find your people</title>
        <meta
          name="description"
          content="Jobless is a board of side quests for people with time on their hands: pickup games, hikes, coffee chats, and crews to do them with. No job required."
        />
        <meta name="theme-color" content="#FAF8F5" />
        <meta property="og:title" content="Jobless — Find your people" />
        <meta
          property="og:description"
          content="Side quests, pickup games, and people to do them with. No job required."
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
