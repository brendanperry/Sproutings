import { Camera, CircleLayer, MapView, MarkerView, PointAnnotation, ShapeSource, SymbolLayer, UserLocation } from "@maplibre/maplibre-react-native";
import { StyleProp, StyleSheet, View, ViewStyle, Text } from "react-native";

type MapProps = {
  center: [number, number],
  zoom: number,
}

const Map = (props: MapProps) => {
    const styleUrl = `https://tiles.openfreemap.org/styles/liberty`;
    
    return (
    <MapView mapStyle={styleUrl} style={styles.map} compassEnabled={false} rotateEnabled={false} pitchEnabled={false}>
      <Camera
        centerCoordinate={props.center}
        zoomLevel={props.zoom}
        animationMode="flyTo"
        animationDuration={2000}
      />
      <PointAnnotation
        id="marker"
        coordinate={props.center}
        title="Marker"
        children={<Text>Marker</Text>}
        onSelected={() => console.log('Marker selected')}
        />
    </MapView>
    )
}

const styles = StyleSheet.create({
    map: {
      flex: 1,
      alignSelf: 'stretch',
    },
  });

export default Map;