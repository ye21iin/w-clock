import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { CityProvider } from '@/context/CityContext';
import { useColorScheme } from '@/hooks/useColorScheme';

/**
 * Renders the application's root layout with theme selection, font gating, navigation, city context, status bar, and toast support.
 *
 * This component waits for the custom font to load before rendering. It selects the navigation theme based on the system color scheme, provides city-related context to descendants, mounts the app navigation stack (including the tabs and not-found routes), and renders a status bar and a global toast container.
 *
 * @returns The root React element containing the ThemeProvider, CityProvider-wrapped navigation stack, StatusBar, and Toast components.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CityProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
      </CityProvider>
    </ThemeProvider>
  );
}
