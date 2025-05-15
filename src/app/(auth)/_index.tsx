import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      {/* Sign In screen will show header */}
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />

      {/* Sign Up screen will hide header */}
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}
