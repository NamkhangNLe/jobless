import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { ActivitiesProvider } from '@/lib/store';
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Load SpaceMono in the background and never gate rendering on it.
    // The mono face is an editorial accent; if the font file is missing or
    // slow (it 404'd on the live site before the deploy pipeline existed),
    // the app must still mount immediately on the system-font fallback
    // declared in ThemedText's caption style.
    let cancelled = false;
    Font.loadAsync({
      SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    })
      .catch(() => {
        // Font unavailable — system fallback applies, app keeps working.
      })
      .finally(() => {
        if (!cancelled) SplashScreen.hideAsync().catch(() => {});
      });
    // Never leave the splash up forever if the font promise hangs.
    const t = setTimeout(() => SplashScreen.hideAsync().catch(() => {}), 2500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return (
    <ActivitiesProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="activity/create"
            options={{ title: 'Start a quest', headerShown: false }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ActivitiesProvider>
  );
}
