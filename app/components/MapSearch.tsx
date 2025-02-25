import { supabase } from "@/utils/supabase";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { TextInput, StyleSheet, View, Text, LayoutAnimation, Alert } from "react-native";

type SearchResult = {
    coordinates: [number, number];
    id: string;
    name: string;
    label: string;
    street: string;
}

type MapSearchProps = {
    mapCenterPoint: [number, number];
    setMapCenterPoint: (coordinates: [number, number]) => void;
    setMapZoom: (zoom: number) => void;
    setSelectedLocationName: (name: string) => void;
}

const MapSearch = (props: MapSearchProps) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    
    const handleSearch = async (text: string) => {
        console.log("SEARCHING FOR: ", text);
        setSearchValue(text)

        if (text.length <= 3) {
            return
        }

        try {
            const result = await supabase.functions.invoke('address-autocomplete', {
                body: {
                    searchText: text,
                    lat: props.mapCenterPoint[0],
                    lng: props.mapCenterPoint[1]
                }
            })

            if (result.error) {
                console.log(result.error);
                return
            }

            const data = result.data as SearchResult[];
            setSearchResults(data);
        } catch (error: any) {
            Alert.alert(error.message)
        }
    }

    const handler = useCallback(debounce(handleSearch, 2000), []);

    return (
        <View style={styles.container}>
            <TextInput
                value={searchValue}
                style={styles.input}
                placeholder="Search for a location"
                autoCapitalize="none"
                keyboardType="default"
                autoCorrect={false}
                returnKeyType="search"
                onChangeText={(text) => handler(text)}
            />

            <View style={styles.resultsContainer}>
                {searchResults.map((result) => (
                    <Text
                        key={result.id}
                        style={styles.result}
                        onPress={() => {
                            props.setMapCenterPoint(result.coordinates)
                            props.setMapZoom(15)
                            props.setSelectedLocationName(result.name)
                        }}>
                        {result.name} {result.street} {result.label}
                    </Text>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        padding: 10,
    },
    resultsContainer: {
        flexDirection: "column",
    },
    result: {
        backgroundColor: "#808080",
        padding: 10,
    },
    container: {
        flexDirection: "column",
        flexGrow: 1
    }
});

const lastResultStyle = {
    ...StyleSheet.flatten([styles.result]),
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
};

export default MapSearch;