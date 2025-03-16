import { CustomDarkTheme } from '@/components/themes/darkTheme';
import { CustomLightTheme } from '@/components/themes/lightTheme';
import { ThemeProvider } from '@react-navigation/native';
import { Slot, Stack } from 'expo-router';
import { useColorScheme, ColorSchemeName } from 'react-native';

export default function RootLayout() {
  const scheme = useColorScheme()

  const getAppTheme = (scheme: ColorSchemeName) => {
    if (scheme == 'dark') {
        return CustomDarkTheme
    } else {
      return CustomLightTheme
    }
  }
  
  return (
    <ThemeProvider value={getAppTheme(scheme)}>
      <Slot />
      {/* <Stack screenOptions={{ headerShown: false, navigationBarHidden: true }}>
        <Stack.Screen name="(tabs)" />
      </Stack> */}
    </ThemeProvider>
  );
}
