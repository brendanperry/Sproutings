import { DarkTheme, DefaultTheme, TabRouter, ThemeProvider, useTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { ColorSchemeName, useColorScheme } from 'react-native';
import { CustomDarkTheme } from "../../../components/themes/darkTheme";
import { CustomLightTheme } from "../../../components/themes/lightTheme";

export default function RootLayout() {
  
  return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen options={{ headerShown: false, title: "Home" }} name="index" />
        <Stack.Screen options={{ headerShown: true, title: "Plan Your Outing" }} name="PlanTrip" />
        <Stack.Screen
          options={{ headerShown: true, title: "Create Your Outing" }}
          name="CreateOuting"
        />
      </Stack>
  );
}
