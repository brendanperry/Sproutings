import { supabase } from '@/utils/supabase';
import { Session } from '@supabase/supabase-js';
import { Link, useFocusEffect } from 'expo-router';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Text, StyleSheet, View, Button, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Auth from './components/Auth';

export default function Home() {
    const [session, setSession] = useState<Session | null>(null)
    const [outings, setOutings] = useState<any[]>([])

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    const fetchOutings = async () => {
        if (session) {
            const { data, error } = await supabase.from('outings').select('*').eq('created_by', session?.user.id)

            if (error) {
                console.error('Error fetching outings:', error)
                return
            }
            console.log('Fetched outings:', data)

            return data
        }
    }
    useFocusEffect(() => {
        fetchOutings()
            .then((data) => { 
                if (data) {
                    setOutings(data)
                }
            }
        )
    })

    const renderOuting = ({ item }: { item: any }) => (
        <View style={styles.outing}>
            <Text style={styles.outingText}>{item.name}</Text>
            <Text style={styles.outingText}>{item.notes}</Text>
        </View>
    );

    return (
        <>
            {session ? (
                <SafeAreaView style={styles.container}>
                    <Text style={styles.header}>Welcome back!</Text>
                    <Link style={styles.link} href="/PlanTrip">Plan a Trip</Link>
                    <Button onPress={() => supabase.auth.signOut()} title="Sign Out" />

                    <FlatList
                        data={outings}
                        renderItem={renderOuting}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.outingsList}
                    />
                </SafeAreaView>
            ) : (
                // If no session, show the login screen
                <Auth />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    header: {
        textAlign: 'center',
        padding: 20,
        fontSize: 30,
        fontWeight: 'bold',
    },
    link: {
        margin: 10,
        padding: 10,
        borderWidth: 2,
        borderRadius: 5,
    },
    outingsList: {
        width: '100%',
        paddingHorizontal: 20,
    },
    outing: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    outingText: {
        fontSize: 16,
    },
});
