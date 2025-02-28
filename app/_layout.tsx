import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
      headerShown: false,
      }}>
      <Stack.Screen options={{headerShown: false, title: "Home" }} name="index" />
      <Stack.Screen options={{headerShown: true, title: "Plan Your Outing" }} name="PlanTrip" />
      <Stack.Screen 
        options={{headerShown: true, title: "Create Your Outing" }} 
        name="CreateOuting" 
        />
    </Stack>
  );
}
