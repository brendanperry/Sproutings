import { supabase } from '@/utils/supabase';
import { Session } from '@supabase/supabase-js';
import { Link, useFocusEffect } from 'expo-router';
import { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, View, FlatList, Image, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Auth from '../../../components/views/Auth';
import { ThemeContext } from '@react-navigation/native';
import Avatar from '../../../assets/images/react-logo.png';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import React from 'react';
import OutdoorsImage from '../../../assets/images/outdoors.png';
import { useSharedValue } from 'react-native-reanimated';

export default function Home() {
    const [session, setSession] = useState<Session | null>(null);
    const [outings, setOutings] = useState<any[]>([]);
    const theme = useContext(ThemeContext);
    const progress = useSharedValue<number>(0);
    const ref = React.useRef<ICarouselInstance>(null);
    const data = [...new Array(6).keys()];
    const width = Dimensions.get("window").width;

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    const fetchOutings = async () => {
        if (session) {
            const { data, error } = await supabase.from('outings').select("name, notes, places(name)").eq('created_by', session?.user.id);

            if (error) {
                console.error('Error fetching outings:', error);
                return;
            }
            // console.log('Fetched outings:', data);

            return data;
        }
    };

    useFocusEffect(() => {
        fetchOutings().then((data) => {
            if (data) {
                setOutings(data);
            }
        });
    });

    const renderOuting = ({ item }: { item: any }) => (
        <View style={styles.outing}>
            <Image source={OutdoorsImage} style={styles.outingImage} resizeMode="cover" />
            <Text style={[styles.outingText, { fontWeight: 'bold'}]}>{item.places.name}</Text>
            <Text style={styles.outingText}>{item.name}</Text>
            <Text style={styles.outingText}>{item.notes}</Text>
        </View>
    );

    return (
        <>
            {session ? (
                <SafeAreaView style={{ ...styles.container, backgroundColor: theme?.colors.background }}>
                    <View style={styles.headerContainer}>
                        <View style={styles.headingContainer}>
                            <Text style={[styles.header, { color: theme?.colors.primary }]}>Hello, Brendan!</Text>
                            <Text style={[styles.subHeader, { color: theme?.colors.text }]}>Let's get outside</Text>
                        </View>
                        <Image source={Avatar} style={styles.avatar} />
                    </View>

                    <Link href='/(tabs)/(home)/PlanTrip' asChild style={[styles.buttonContainer, { backgroundColor: theme?.colors.primary }]}>
                        <Pressable>
                            <Text style={[styles.button, { color: theme?.colors.background }]}>Plan your next outing</Text>
                        </Pressable>
                    </Link>

                    <Text style={[styles.outingsHeader, { color: theme?.colors.primary }]}>Your Outings</Text>

                    <Carousel
                        ref={ref}
                        width={width}
                        // height={width / 2}
                        data={outings}
                        onProgressChange={progress}
                        mode='parallax'
                        loop={false}
                        renderItem={renderOuting}
                    />
{/* 
                    <FlatList
                        data={outings}
                        renderItem={renderOuting}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.outingsList}
                    /> */}
                </SafeAreaView>
            ) : (
                <Auth />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    headerContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        width: '100%',
    },
    headingContainer: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        padding: 10,
    },
    avatar: {
        color: '#828282',
        height: 40,
        width: 40,
    },
    header: {
        textAlign: 'left',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'DreamOrphanageRg-Regular',
    },
    outingsHeader: {
        textAlign: 'left',
        padding: 20,
        fontSize: 24,
        fontWeight: 'bold',
        width: '100%',
        fontFamily: 'DreamOrphanageRg-Regular',
    },
    subHeader: {
        textAlign: 'left',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Gogh-ExtraBold',
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
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    outingImage: {
        width: '100%',
        height: 300,
        // borderRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 10,
    },
    outingText: {
        fontSize: 16,
        color: '#000',
        padding: 10
    },
    buttonContainer: {
        backgroundColor: '#828282',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        margin: 20,
    },
    button: {
        fontSize: 18,
        padding: 15,
        fontFamily: 'Gogh-ExtraBold',
    },
    carouselItem: {
        borderRadius: 10,
        overflow: 'hidden',
        margin: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    carouselImage: {
        width: '100%',
        height: 200,
    },
    carouselText: {
        fontSize: 16,
        padding: 10,
        textAlign: 'center',
    },
});
