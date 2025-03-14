import { ThemeContext } from '@react-navigation/native';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { useContext, useState } from 'react';
import { Text, StyleSheet } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function TabLayout() {
  const theme = useContext(ThemeContext)
  const [selectedTab, setSelectedTab] = useState('home');

  const handleTabPress = (tabName: string) => {
    setSelectedTab(tabName);
  };
  
  return (
    <Tabs>
      <TabSlot />
        <TabList style={[styles.container, { backgroundColor: theme?.colors.primary }]}>
          <TabTrigger name="home" href="/" style={selectedTab == "home" ? styles.selectedTab : styles.tab} onPress={() => handleTabPress("home")}>
            <FontAwesome6 name="house" size={24} color={selectedTab == "home" ? theme?.colors.primary : "white"} />          
          </TabTrigger>
          <TabTrigger name="social" href="/social" style={selectedTab == "social" ? styles.selectedTab : styles.tab} onPress={() => handleTabPress("social")}>
            <FontAwesome6 name="user-group" size={24} color={selectedTab == "social" ? theme?.colors.primary : "white"} />          
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" style={ selectedTab == "settings" ? styles.selectedTab : styles.tab} onPress={() => handleTabPress("settings")}>
            <FontAwesome6 name="gear" size={24} color={selectedTab == "settings" ? theme?.colors.primary : "white"} />          
          </TabTrigger>
        </TabList>
    </Tabs>
  );
}


const styles = StyleSheet.create({
  container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 50,
      margin: 10,
      borderRadius: 1000
  },
  tab: {
    padding: 10,
    margin: 10
  },
  selectedTab: {
    padding: 10,
    margin: 10,
    backgroundColor: '#FFFF',
    borderRadius: 1000,
  }
});