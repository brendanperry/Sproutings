import { Text, View, StyleSheet, Alert } from "react-native";
import { CircleLayer, MapView, ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";
import React, { useEffect, useState } from "react";

const styleUrl = `https://tiles.openfreemap.org/styles/liberty`;
const geoJsonUrl = 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson';


export default function Index() {
  const handlePress = (event: { features: any; }) => {
    const { features } = event;
    if (features.length > 0) {
      const feature = features[0];
      Alert.alert('Feature Pressed', `ID: ${feature.properties.id}\nMagnitude: ${feature.properties.mag}`);
    }
  };

  return (
    <View style={styles.page}>
      {/* need attribution */}
      <MapView mapStyle={styleUrl} style={styles.map} attributionEnabled={false} compassEnabled={false} rotateEnabled={false} pitchEnabled={false}>
        <ShapeSource id="earthquakes" url={geoJsonUrl} onPress={handlePress} cluster={true} clusterRadius={50}>
          <SymbolLayer
            id="earthquakeSymbols"
            style={{
              textField: ["get", "id"],
              textFont: ["Noto Sans Regular"],
            }}
          />
          <CircleLayer
            id="clusteredPoints"
            filter={['has', 'point_count']}
            style={{
              circleColor: 'rgba(0, 0, 255, 0.6)',
              circleRadius: 18,
              circleStrokeWidth: 2,
              circleStrokeColor: 'rgba(0, 0, 255, 1)',
            }}
          />
          <SymbolLayer
            id="clusterCount"
            filter={['has', 'point_count']}
            style={{
              textField: '{point_count}',
              textFont: ["Noto Sans Regular"],
              textSize: 12,
              textColor: 'rgba(255, 255, 255, 1)',
            }}
          />
        </ShapeSource>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
