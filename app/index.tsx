import { supabase } from '@/utils/supabase';
import { Session } from '@supabase/supabase-js';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Auth from './components/Auth';

export default function Home() {
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    return (
        <>
            {session ? (
                <SafeAreaView style={styles.container}>
                    <Text style={styles.header}>Welcome back!</Text>
                    <Link style={styles.link} href="/PlanTrip">Plan a Trip</Link>
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
});
