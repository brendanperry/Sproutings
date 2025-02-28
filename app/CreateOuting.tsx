import { supabase } from '@/utils/supabase';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

const CreateOuting = () => {
    const params = useLocalSearchParams();
    const { locationName, latitude, longitude } = params;

    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');

    const createPlace = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
            Alert.alert('Error', userError.message);
            return;
        }

        const { data, error } = await supabase
            .from('places')
            .insert([
                { name: locationName, location: `POINT(${longitude} ${latitude})`, created_by: userData.user.id }
            ])
            .select('id');
        if (error) {
            Alert.alert('Error', error.message);
            return;
        }
        if (data == null) {
            Alert.alert('Error', 'Failed to create place');
            return;
        }
        Alert.alert('Success', 'Place created successfully');
        return data[0].id;
    };

    const getPlaceId = async () => {
        const { data, error } = await supabase.rpc('get_place_id', { long: longitude, lat: latitude });
        
        if (error) {
            Alert.alert('Error', error.message);
            return;
        }

        if (data) {
            return data
        } else {
            const placeId = await createPlace();
            return placeId;
        } 
    };

    const createOuting = async (placeId: number) => {
        const { error } = await supabase
            .from('outings')
            .insert([
                { name: name, notes: notes, place: placeId }
            ])
        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Success', 'Outing created successfully');
            setName('');
            setNotes('');
        }
    };

    const handleSubmit = async () => {
        if (name && notes) {
            const placeId = await getPlaceId();
            if (placeId) {
                createOuting(placeId);
            }
        } else {
            Alert.alert('Error', 'Please fill out both fields');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Notes"
                value={notes}
                onChangeText={setNotes}
                multiline
            />
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default CreateOuting;