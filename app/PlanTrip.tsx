import { SafeAreaView, Text, StyleSheet, View, Button, Dimensions, Platform, UIManager, LayoutAnimation } from 'react-native';
import Map from './components/Map';
import MapSearch from './components/MapSearch';
import { useState, useRef, useEffect } from 'react';
import Animated, { Easing, FadeIn, FadeOut, SlideInDown, SlideInUp, SlideOutDown } from 'react-native-reanimated';

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PlanTrip() {
    const [mapCenter, setMapCenter] = useState<[number, number]>([-85.4922797, 41.1759911]);
    const [mapZoom, setMapZoom] = useState<number>(10);
    const [selectedLocationName, setSelectedLocationName] = useState<String | undefined>(undefined);

    return (
        <>
            <Map center={mapCenter} zoom={mapZoom} />
            <SafeAreaView style={styles.container}>
                <MapSearch 
                    setMapCenterPoint={(point) => setMapCenter(point) } 
                    setMapZoom={(zoom) => setMapZoom(zoom)} 
                    setSelectedLocationName={(name) => setSelectedLocationName(name)} 
                    mapCenterPoint={mapCenter}
                />
            </SafeAreaView>

            { selectedLocationName !== undefined && (
                <Animated.View style={styles.floatingContainer} entering={SlideInDown.easing(Easing.elastic(0.75))} exiting={SlideOutDown}>
                    <Text style={styles.header}>{selectedLocationName}</Text>
                    <Button title="Get Directions" onPress={() => console.log('Get Directions')} />
                    <Button title="Save Location" onPress={() => console.log('Save Location')} />
                    <Button title="Cancel" onPress={() => { setSelectedLocationName(undefined)} } />
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