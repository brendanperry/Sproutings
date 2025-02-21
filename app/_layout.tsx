import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen options={{headerShown: false, title: "Home" }} name="index" />
      <Stack.Screen options={{headerShown: true, title: "Plan Your Trip" }} name="PlanTrip" />
    </Stack>
  );
}
