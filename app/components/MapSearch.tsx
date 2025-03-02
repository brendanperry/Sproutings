import { supabase } from "@/utils/supabase";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { TextInput, StyleSheet, View, Text, LayoutAnimation, Alert } from "react-native";
import type { SelectedLocation } from '../PlanTrip'

type SearchResult = {
    coordinates: [number, number];
    id: string;
    name: string;
    label: string;
    street: string;
}

type MapSearchProps = {
    mapCenterPoint: [number, number];
    setSelectedLocation: (location: SelectedLocation) => void;
}

const MapSearch = (props: MapSearchProps) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    
    const handleSearch = async (text: string) => {
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

    const searchHandler = useCallback(debounce(handleSearch, 300), []);

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
                onChangeText={(text) =>  {
                    setSearchValue(text)
                    searchHandler(text)
                }}
            />

            <View style={styles.resultsContainer}>
                {searchResults.map((result) => (
                    <Text
                        key={result.id}
                        style={styles.result}
                        onPress={() => {
                            props.setSelectedLocation({ name: result.name, coordinates: result.coordinates })
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