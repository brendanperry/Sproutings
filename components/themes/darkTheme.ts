import { DarkTheme } from "@react-navigation/native";

export const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: '#3498db',
        background: '#121212',
        card: '#1e1e1e',
        text: '#ffffff',
        border: '#333333',
        notification: '#f1c40f',
    },
};