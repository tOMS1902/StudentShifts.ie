import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }: any) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userStr = await AsyncStorage.getItem('ss:user');
            if (userStr) {
                setUser(JSON.parse(userStr));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('ss:user');
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            {user && user.user && (
                <Text style={styles.name}>{user.user.firstName}</Text>
            )}

            <Text style={styles.placeholder}>Your Job Feed will appear here.</Text>

            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#d946ef',
        marginBottom: 40,
    },
    placeholder: {
        fontSize: 16,
        color: '#999',
        marginBottom: 60,
    },
    button: {
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
