import { supabase } from "@/utils/supabase";
import { Camera, CircleLayer, Images, MapView, ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";
import { OnPressEvent } from "@maplibre/maplibre-react-native/lib/typescript/commonjs/src/types/OnPressEvent";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SelectedLocation } from "../../app/(stack)/PlanTrip";
import MapPin from '../../assets/images/map-signs-solid.png'; // Import the image

type MapProps = {
  center: [number, number],
  zoom: number,
  setSelectedLocation: (location: SelectedLocation) => void;
}

const Map = (props: MapProps) => {
    const styleUrl = `https://tiles.openfreemap.org/styles/liberty`;
    const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(null);

    const getGeoJson = async () => {
      const { data, error } = await supabase.storage.from('geojson').download('places.geojson');

      if (data == null) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        const json = JSON.parse(text) as GeoJSON.FeatureCollection;
        setGeoJsonData(json);
      };
      reader.readAsText(data);
    }

    useEffect(() => {
      getGeoJson();
    }, [geoJsonData]);

    const handlePress = (event: OnPressEvent) => {
      const feature = event.features[0];
      if (feature == null) { return; }
      const properties = feature.properties;
      if (properties == null) { return; }

      if (properties.name == undefined) { return; }

      if (feature.geometry.type === 'Point') {
        const coordinates = feature.geometry.coordinates;
        props.setSelectedLocation({ name: properties.name, coordinates: [coordinates[0], coordinates[1]] });
      }
    };
    
    return (
      <MapView 
        mapStyle={styleUrl} 
        style={styles.map} 
        compassEnabled={false} 
        rotateEnabled={false}
        pitchEnabled={false}>
        {geoJsonData && (
          <>
          <Images images={{ pin: MapPin }} />
          <ShapeSource id="places" shape={geoJsonData} cluster={true} onPress={handlePress}>
            <SymbolLayer
              id="placeSymbols"
              style={{
                textField: ["get", "name"],
                textFont: ["Noto Sans Regular"],
                iconImage: "pin",
                iconSize: 0.25,
                textAnchor: "bottom",
                textOffset: [0, -1.5]
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
          </>
        )}
        <Camera
          centerCoordinate={props.center}
          zoomLevel={props.zoom}
          animationMode="flyTo"
          animationDuration={2000}
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