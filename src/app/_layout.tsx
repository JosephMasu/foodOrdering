import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/src/components/useColorScheme';
import CartProvider from "@/src/providers/CartProvider";
import AuthProvider from '../providers/AuthProvider';
import QueryProvider from '../providers/QueryProvider';
import {StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const publishableKey = Constants.expoConfig?.extra?.EXPO_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  || (Constants.manifest as any)?.extra?.EXPO_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  || "";
  return (
    <StripeProvider publishableKey={publishableKey}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <QueryProvider>
            <CartProvider>
              <Stack>
                <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                <Stack.Screen name="(user)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="cart" options={{ presentation: 'modal' }} />
              </Stack>
            </CartProvider>
          </QueryProvider>
        </AuthProvider>
      </ThemeProvider>
    </StripeProvider>
  );
}
