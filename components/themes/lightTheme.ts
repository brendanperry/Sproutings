import { DefaultTheme } from "@react-navigation/native";

export const CustomLightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        // primary: '#327769',
        primary: '#225D2D',
        background: '#f4f6f8',
        card: '#00ADB5',
        text: '#4E9F3D',
        border: '#dddddd',
    },
};