import { SafeAreaView, Text, StyleSheet, View, Button, Dimensions, Platform, UIManager, LayoutAnimation } from 'react-native';
import Map from '../../../components/views/Map';
import MapSearch from '../../../components/views/MapSearch';
import { useState, useRef, useEffect } from 'react';
import Animated, { Easing, FadeIn, FadeOut, SlideInDown, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { Link } from 'expo-router';

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type SelectedLocation = {
    coordinates: [number, number];
    name: string
}

export default function PlanTrip() {
    const [mapCenter, setMapCenter] = useState<[number, number]>([-85.4922797, 41.1759911]);
    const [mapZoom, setMapZoom] = useState<number>(10);
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

    const updateSelectedLocation = (location: SelectedLocation) => {
        setSelectedLocation(location);
        setMapCenter(location.coordinates);
        setMapZoom(15);
    }

    return (
        <>
            <Map 
                center={mapCenter} 
                zoom={mapZoom} 
                setSelectedLocation={(location) => updateSelectedLocation(location)}
            />
            <SafeAreaView style={styles.container}>
                <MapSearch 
                    setSelectedLocation={(location) => updateSelectedLocation(location)} 
                    mapCenterPoint={mapCenter}
                />
            </SafeAreaView>

            { selectedLocation !== null && (
                <Animated.View style={styles.floatingContainer} entering={SlideInDown.easing(Easing.elastic(0.75))} exiting={SlideOutDown}>
                    <Text style={styles.header}>{selectedLocation.name}</Text>
                    <Button title="Get Directions" onPress={() => console.log('Get Directions')} />
                    <Button title="Save Location" onPress={() => console.log('Save Location')} />
                    {selectedLocation.coordinates && (
                        <Link href={{ pathname: "/CreateOuting", params: { locationName: selectedLocation.name, longitude: selectedLocation.coordinates[0], latitude: selectedLocation.coordinates[1]} }}>Create Outing</Link>
                    )}
                    <Button title="Cancel" onPress={() => { setSelectedLocation(null)} } />
                </Animated.View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    floatingContainer: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 5,
        flexDirection: 'column',
        bottom: -10, // Ensures the bottom of the container doesn't go above the bottom of the screen during the animation bounce
        left: 0,
        right: 0,
        paddingBottom: 50,
        padding: 20,
        height: Dimensions.get('window').height * 0.4,
        shadowRadius: 10,
        shadowOpacity: 0.25,
        shadowColor: '#000',
    },
    container: {
        position: 'absolute',
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 5,
        flexDirection: 'row',
    },
    header: {
        textAlign: 'center',
        padding: 20,
        fontSize: 30,
        fontWeight: 'bold',
    },
    link: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 5,
    },
    map: {
        flex: 1,
        alignSelf: 'stretch',
        position: 'absolute',
    },
});