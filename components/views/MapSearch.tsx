import { supabase } from "@/utils/supabase";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { TextInput, StyleSheet, View, Text, LayoutAnimation, Alert, Keyboard, TouchableOpacity } from "react-native";
import type { SelectedLocation } from '../../app/(stack)/PlanTrip'
import { Ionicons } from '@expo/vector-icons';

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

    const endSearch = () => {
        Keyboard.dismiss()
        setSearchResults([])
    }

    const searchHandler = useCallback(debounce(handleSearch, 300), []);

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    value={searchValue}
                    style={styles.input}
                    placeholder="Search for a location"
                    autoCapitalize="none"
                    keyboardType="default"
                    autoCorrect={false}
                    returnKeyType="done"
                    placeholderTextColor="#808080"
                    onSubmitEditing={() => {
                        endSearch()
                    }}
                    onChangeText={(text) =>  {
                        setSearchValue(text)
                        searchHandler(text)
                    }}
                />
                {searchValue.length > 0 && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => {
                            setSearchValue("");
                            setSearchResults([]);
                        }}
                    >
                        <Ionicons name="close-circle" size={20} color="#808080" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.resultsContainer}>
                {searchResults.map((result, index) => (
                    <Text
                        key={result.id}
                        style={index == (searchResults.length - 1) ? lastResultStyle : styles.result }
                        onPress={() => {
                            endSearch()
                            setSearchValue(result.name)
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
    container: {
        flexDirection: "column",
        flexGrow: 1
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    input: {
        flex: 1,
        padding: 10,
        color: "#000000"
    },
    clearButton: {
        marginLeft: 10,
    },
    resultsContainer: {
        flexDirection: "column",
    },
    result: {
        backgroundColor: "#808080",
        padding: 10,
    },
});

const lastResultStyle = {
    ...StyleSheet.flatten([styles.result]),
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
};


export default MapSearch;